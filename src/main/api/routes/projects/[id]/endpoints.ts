import { Request, Response } from 'express';
import { ProjectService } from "../../../../api/services/ProjectService";
import { EndpointService } from "../../../../api/services/EndpointService";

const endpointService = new EndpointService();
const projectService = new ProjectService();

// get all endpoints under project :id
export const GET = async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;
    
    const project = projectService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'project not found '});
    }

    const endpoints = endpointService.getEndpointsByProject(projectId);
    const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
      const folderName = endpoint.folder || 'General';
      if (!acc[folderName]) acc[folderName] = [];
      acc[folderName].push(endpoint);
      return acc;
    }, {} as { [folder: string]: any[] });

    res.json({ 
      endpoints,
      groupedEndpoints,
      stats: endpointService.getEndpointStats(projectId)
    });
  } catch (error) {
    console.error('Failed to fetch endpoints:', error);
    res.status(500).json({ error: 'Failed to fetch endpoints' });
  }
}

// create endpoint under project :id
export const POST = async(req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { path } = req.body;
    
    const project = projectService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'project not found '});
    }

    const endpoint = endpointService.createEndpoint({
      projectId,
      path,
      method: 'GET',
      title: 'New Endpoint',
      operationId: ''
    });

    res.json({ endpoint });
  } catch (error) {
    console.error('Failed to fetch endpoints:', error);
    res.status(500).json({ error: 'Failed to fetch endpoints' });
  }
}