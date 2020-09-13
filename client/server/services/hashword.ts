import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Hashword {
  static async toHash(password:string) {
    let salt = randomBytes(8).toString('hex');
    let buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
  static async compare(stored:string, supplied:string) {
    let [ hashed, salt ] = stored.split('.');
    let buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return buf.toString('hex') === hashed;
  }
}