import { Service } from './service';
import { Blog } from './blog';
import { ContactMessage } from './contact';

export interface DashboardData {
  total_services: number;
  total_blogs: number;
  published_blogs: number;
  total_gallery_items: number;
  total_faqs: number;
  total_contact_messages: number;
  new_contact_messages: number;
  recent_contact_messages: ContactMessage[];
  recent_blogs: Blog[];
  recent_services: Service[];
}
