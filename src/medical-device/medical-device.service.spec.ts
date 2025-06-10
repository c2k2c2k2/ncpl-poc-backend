import { Test, TestingModule } from '@nestjs/testing';
import { MedicalDeviceService } from './medical-device.service';

describe('MedicalDeviceService', () => {
  let service: MedicalDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalDeviceService],
    }).compile();

    service = module.get<MedicalDeviceService>(MedicalDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
