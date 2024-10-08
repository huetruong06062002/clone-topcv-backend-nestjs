import { Injectable, Query } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';
@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>
  ) {
  }
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const createdCompany = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    });

    return createdCompany.save();
  }

  async findAll(currrentPage : number, limit : number, qs : string) {
    const { filter, projection, population } = aqp(qs);
    let { sort }= <{sort: any}>aqp(qs); 
    // let { sort }: {sort: any}= aqp(rq);

    delete filter.current
    delete filter.pageSize

    let offset = (+currrentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;

    const totalPages = Math.ceil(totalItems / defaultLimit);

    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }


    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .exec();

      return {
        meta: { 
          current: currrentPage, //trang hiện tại
          pageSize: limit, //số lượng bản ghi đã lấy
          pages: totalPages,  //tổng số trang với điều kiện query
          total: totalItems // tổng số phần tử (số bản ghi)
        },
        result //kết quả query
      }
  
      
  }

  async findOne(id: string) {
    return await this.companyModel.findOne({ _id: id });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      });

  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      {_id :id},
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      }
    )
    return this.companyModel.softDelete({_id : id });
  }
}
