import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
// import { ValidationException } from "src/exceptions/validation.exceptions";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, {metatype}: ArgumentMetadata): Promise<any> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        if (typeof value === "object" && value.constructor === Object && !Object.keys(value).length) {
            return value;
        }
        // функция plainToInstance преобразовываем нужные нам значения в обьект Javascript'a
        const obj = plainToInstance(metatype, value);
        const errors = await validate(obj);

        if (errors.length > 0) {
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints ?? {}).join(' \n')}`
            })
            let errorMessage = "";
            for (let i = 0; i < messages.length; i++) {
                errorMessage += (messages[i] + '\n');
            }
            console.log(errorMessage);
            throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}