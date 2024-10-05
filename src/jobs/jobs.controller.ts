import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }



  @ResponseMessage("Fetch jobs  with paginate")
  @Get()

  findAll(@Query("current") currrentPage: string, //req.query.page
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.jobsService.findAll(+currrentPage, +limit, qs);
  }


  @ResponseMessage("Fetch Job by ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }


  @ResponseMessage("Update Job by ID")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Delete Job by ID")

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
