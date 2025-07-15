import { dbManager } from ".";
import { ProjectModel } from "./models/Project";

export function testDatabase() {
  console.log('Testing database connection...');

  const db = dbManager.connect();
  const projectModel = new ProjectModel();

  const testProject = projectModel.create({
    name: 'Test API Project',
    description: 'A test project for the database',
    version: '1.0.0',
    baseUrl: 'https://api.test.com'
  });

  console.log('Created project:', testProject);

  const retrieved = projectModel.findById(testProject.id);

  projectModel.delete(testProject.id);
  console.log('Database test completed successfully.');
}