import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('schema/recreate')
  recreateDatabaseSchema() {
    return this.assistantService.recreateDatabaseSchema();
  }

  @Post('schema/persist')
  persistDatabaseSchema() {
    return this.assistantService.persistDatabaseSchema();
  }

  @Delete('tables')
  removeTables() {
    return this.assistantService.removeTables();
  }

  @Delete('data')
  removeData() {
    return this.assistantService.removeData();
  }
}
