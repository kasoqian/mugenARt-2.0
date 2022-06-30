export interface sorceDataType {
  circulation: number;
  contract_addr: string;
  contract_addr_id: string;
  create_by: string;
  create_time: string;
  creater_description: string;
  creater_header_url: string;
  creater_name: string;
  edition: number;
  id: string;
  // o = false | 1 = true
  is_user_own: 0 | 1;
  // o = false | 1 = true
  need_light: 0 | 1;
  operator: string;
  product_attribute: string;
  product_creater: string;
  product_creater_id: number;
  product_creater_image_url: string;
  product_creater_introduce: string;
  product_image_data_url: string;
  product_image_url: string;
  product_introduce: string;
  product_ip_id: string;
  product_ip_name: string;
  product_ip_series_id: string;
  product_ip_series_name: string;
  product_model_url: string;
  product_name: string;
  product_rarity: string;
  product_remain: number;
  product_status: number;
  rarity_id: number;
  update_time: string;
}
