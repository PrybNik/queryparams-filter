import { mockData } from './mockData';

class DataService {
  async getDataService() {
    try {
      const response = mockData;
      return response;
    } catch (error) {
      return null;
    }
  }
}

const ServiceInstance = new DataService();

export default ServiceInstance;
export { ServiceInstance as DataService };
