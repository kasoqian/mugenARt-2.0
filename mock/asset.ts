// @ts-ignore
import Mock from 'mockjs';

export default {
  'POST /api/mugenArt/assert/getUserAssert': Mock.mock({
    code: '0',
    message: '成功',
    'data|10': [
      {
        id: '@increment(1)',
        user_addr: '@cword(10,15)',
        product_id: '@cword(11)',
        ip_id: '111',
        assert_number_in_nft: '232',
        assert_token_id: 'DSC11', //token id
        assert_name: 'VFDVB111', //资产name
        assert_description: 'BGFDB452452045045', //资产描述
        ip_name: 'firstIp1', //ip name
        series_name: 'xilie31', //系列名
        //资产image，在用户资产首页展示用
        assert_image_url:
          'https://mugenart-test.s3.ap-southeast-1.amazonaws.com/6c4b8775-b99d-4470-8177-a1a8e654132c',
        ///资产模型，点击check，进入详情页展示用
        assert_model_url:
          'https://mugenart-test.s3.ap-southeast-1.amazonaws.com/3e17dfd0-9238-4804-9e83-4cfdb16568e6',
        //发行量
        circulation: 200,
        create_time: '2022-03-08 21:21:55',
        update_time: '2022-03-08 21:47:05',
      },
    ],
  }),
  'POST /api/mugenArt/ip/getAllIpIdAndEnName': Mock.mock({
    code: '0',
    message: '成功',
    data: [
      {
        ip_id: '111',
        ip_name: 'firstIp1',
      },
      {
        ip_id: '222',
        ip_name: 'firstIp12',
      },
    ],
  }),
  'POST /api/mugenArt/assert/getUserAssertById': Mock.mock({
    code: '0',
    message: '成功',
    data: {
      id: '1452542',
      user_addr: '123',
      product_id: '20220308-02',
      ip_id: 'bcjdsacdskacmdsacjdsa1545c10231',
      assert_number_in_nft: '232',
      assert_token_id: 'DSC11',
      assert_name: 'VFDVB111',
      assert_description:
        "In the tumultuous business of cutting-in and attending to a whale,there is much running backwards and forwards among the crew. Now hands are wanted here, and then again hands are wanted there. There is no staying in any one place; for at one and the same time everything has to be done everywhere. It is much the same with him who endeavors the description of the scene. We must now retrace our way a little. It was mentioned that upon first breaking ground in the whale's back.",
      ip_name: 'firstIp1',
      series_name: 'xilie31',
      assert_image_url:
        'https://mugen-storefront.oss-cn-beijing.aliyuncs.com/sku/0/image_cover.png',
      assert_model_url:
        'https://mugen-storefront.oss-cn-beijing.aliyuncs.com/sku/0/animation_url.glb',
      circulation: 200,
      create_time: '2022-03-08 21:21:55',
      update_time: '2022-03-08 21:47:05',
    },
  }),
};
