import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    NotFoundException,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { IDValidationPipe } from '../pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        @Inject(ProductService) private readonly productService: ProductService,
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get(':id')
    async get(@Param('id', IDValidationPipe) id: string) {
        const product = await this.productService.getById(id);

        if (!product) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }

        return product;
    }

    /**
     * What is the difference between put and patch?
     * PUT uses the request URI to supply a modified version of the requested resource which replaces the original version of the resource
     * PATCH supplies a set of instructions to modify the resource.
     */
    @Patch(':id')
    async patch(
        @Param('id', IDValidationPipe) id: string,
        @Body() updateProductDto: ProductModel,
    ) {
        const updatedProduct = await this.productService.updateById(
            id,
            updateProductDto,
        );

        if (!updatedProduct) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }

        return updatedProduct;
    }

    @Delete(':id')
    async delete(@Param('id', IDValidationPipe) id: string) {
        const deletedProduct = await this.productService.deleteById(id);

        if (!deletedProduct) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }
    }

    @HttpCode(200)
    @Post('find') // TODO: mb get?
    async find(@Body() findProductDto: FindProductDto) {
        return this.productService.findWithReviews(findProductDto);
    }
}
