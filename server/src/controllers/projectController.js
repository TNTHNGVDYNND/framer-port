import Project from "../models/Project.js";

// L-5/#37: explicit allowlist — the ONLY project fields a request may write.
// Mass-assignment surface closed: smuggled keys (role/_id/__v/createdAt/…)
// never reach mongoose, on create OR update. Keep in lockstep with the schema.
const PROJECT_WRITABLE_FIELDS = [
  "title",
  "description",
  "imageUrl",
  "projectUrl",
  "tags",
  "category",
  "featured",
];

const pickProjectFields = (body) => {
  const picked = {};
  for (const field of PROJECT_WRITABLE_FIELDS) {
    if (body && field in body) {
      picked[field] = body[field];
    }
  }
  return picked;
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const projects = await Project.find(filter)
      .sort({ featured: -1, createdAt: -1 }) // Featured first, then newest
      .select("-__v");

    res.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).select("-__v");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(pickProjectFields(req.body));

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      pickProjectFields(req.body),
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
      id: project._id,
    });
  } catch (error) {
    next(error);
  }
};
