import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';

export class getRoomDto {
  id: string;
  description: string;
  product: Product;
  user: userRole;
  otherUser: userRole;
  messages: [];
}

class userRole {
  role: string;
  user: User;
}
