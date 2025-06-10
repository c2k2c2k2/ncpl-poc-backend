import { Test, TestingModule } from '@nestjs/testing';
import { MedicalDeviceController } from './medical-device.controller';

describe('MedicalDeviceController', () => {
  let controller: MedicalDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalDeviceController],
    }).compile();

    controller = module.get<MedicalDeviceController>(MedicalDeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
