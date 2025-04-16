import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
// import { ValidationException } from "src/exceptions/validation.exceptions";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, {metatype}: ArgumentMetadata): Promise<any> {
        if (!metatype || !this.toValidate(metatype)) {
            // console.log("check fauld, metatype:", metatype, "value:", value);
            return value;
        }
        if (typeof value === "object" && value.constructor === Object && !Object.keys(value).length) {
            // console.log("value.constructor === Object");
            return value;
        }
        // функция plainToInstance преобразовываем нужные нам значения в обьект Javascript'a
        const obj = plainToInstance(metatype, value);
        // console.log("validation.pipe value:", value);
        // console.log(1);
        const errors = await validate(obj);
        // console.log(2);

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