import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';
import { Message } from '../schemas/message.schema';
import { History } from 'src/history/schema/history.schema';

export class getRoomDto {
  id: string;
  description: string;
  product: Product;
  user: userRole;
  otherUser: userRole;
  lastMessage: Message;
  isRead: boolean;
  history: History;
}

class userRole {
  role: string;
  user: User;
}
