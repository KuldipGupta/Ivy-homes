import { getProjects, getProjectById } from '../services/projectService.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/apiError.js';

export function getAllProjects(req, res, next) {
  try {
    const result = getProjects(req.query);
    return sendResponse(res, 200, 'Projects fetched successfully', result.results, {
      total: result.total,
      page: result.page,
      page_size: result.page_size,
      total_pages: result.total_pages,
      has_more: result.has_more
    });
  } catch (err) {
    next(err);
  }
}

export function getSingleProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = getProjectById(id);

    if (!project) {
      throw ApiError.notFound(`Project with ID '${id}' not found`);
    }

    return sendResponse(res, 200, 'Project details retrieved', project);
  } catch (err) {
    next(err);
  }
}
