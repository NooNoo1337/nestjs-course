import {
    Body,
    Query,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IDValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
    constructor(
        @Inject(TopPageService) private readonly topPageService: TopPageService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IDValidationPipe) id: string) {
        const page = await this.topPageService.getById(id);

        if (!page) throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

        return page;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = await this.topPageService.getByAlias(alias);

        if (!page) throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

        return page;
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IDValidationPipe) id: string,
        @Body() updateTopPageDto: TopPageModel,
    ) {
        const updatedPage = await this.topPageService.updateById(
            id,
            updateTopPageDto,
        );

        if (!updatedPage) throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

        return updatedPage;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IDValidationPipe) id: string) {
        const deletedPage = await this.topPageService.deleteById(id);

        if (!deletedPage) throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);

        return deletedPage;
    }

    @HttpCode(200)
    @Post('findByCategory') // TODO: mb get?
    async findByCategory(@Body() findTopPageDto: FindTopPageDto) {
        return this.topPageService.findByCategory(findTopPageDto);
    }

    /**
     * TODO: GET with query fails with auth error (wtf?)
     */
    @HttpCode(200)
    @Post('findByText/:q')
    async findByText(@Param('q') query: string) {
        return this.topPageService.findByText(query);
    }
}
