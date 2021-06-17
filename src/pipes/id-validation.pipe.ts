import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    Logger,
    PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
    ID_VALIDATION_ERROR,
    ID_VALIDATION_PLACE_WARN,
} from './id-validation.constants';

/**
 * Validates mongodb objects ids in route params
 */
@Injectable()
export class IDValidationPipe implements PipeTransform {
    private readonly logger = new Logger(IDValidationPipe.name);

    transform(value: string, metadata: ArgumentMetadata) {
        if (metadata.type !== 'param') {
            this.logger.warn(ID_VALIDATION_PLACE_WARN);
            return value;
        }

        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException(ID_VALIDATION_ERROR);
        }

        return value;
    }
}
