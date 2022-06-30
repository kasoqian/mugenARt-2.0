import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useModel, useIntl, Link } from 'umi';
import { Select } from 'antd';
const { Option } = Select;

import './index.less';
import useLocals from '@/hooks/useLocals';

interface IProps {}

export default (props: IProps) => {
  const [activeIpId, setActiveIpId] = useState(null);
  const [activeIpItem, setActiveIpItem] = useState<any>({});
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [activeCharacterItem, setActiveCharacterItem] = useState<any>({});
  const { serieList } = useModel('useMugenSeries');
  const { language } = useLocals();

  const {
    boxList,
    specialThankList,
    getBoxListByIpId,
    getSpecialThankListByBoxId,
  } = useModel('useMugenBox');

  useEffect(() => {
    if (serieList.length) {
      setActiveIpId(serieList[0]?.id);
    }
  }, [serieList]);

  useEffect(() => {
    const item = serieList?.find((item) => item.id === activeIpId) || {};
    setActiveIpItem(item);
    setActiveCharacterId(item?.character_beans?.[0]?.id);
    setActiveCharacterItem(item?.character_beans?.[0] || {});
    getBoxListByIpId({ ipId: activeIpId });
    getSpecialThankListByBoxId({ ipId: activeIpId });
  }, [serieList, activeIpId]);

  useEffect(() => {
    const item =
      activeIpItem?.character_beans?.find(
        (item: any) => item.id === activeCharacterId,
      ) || {};
    setActiveCharacterItem(item);
  }, [activeIpItem, activeCharacterId]);

  return (
    <div className="mugen-series">
      <div
        className="ip-desc-wapper"
        style={{
          backgroundImage: `url(${
            activeIpItem[`ip_description_image_${language}_url`] || null
          })`,
        }}
      >
        <div className="ip-desc-container">
          <div className="mugen-ip-list">
            <div className="ip-tab-list" id="ip-tab-list">
              <Select
                value={activeIpId}
                onChange={setActiveIpId}
                dropdownClassName="ip-tab-drop-down"
                getPopupContainer={() =>
                  document.querySelector('#ip-tab-list') as HTMLElement
                }
              >
                {serieList.map((item) => {
                  return (
                    <Option className="option" value={item.id} key={item.id}>
                      {item[`ip_name_${language}`]}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div
        className="ip-character-wapper"
        style={{
          backgroundImage: `url(${
            activeCharacterItem.character_image_url || ''
          })`,
        }}
      >
        <div className="ip-character-container">
          <div className="character-list">
            {activeIpItem?.character_beans?.map((item: any) => {
              return (
                <div
                  className={classNames('character', {
                    active: activeCharacterId === item.id,
                  })}
                  key={item.id}
                  onClick={() => setActiveCharacterId(item.id)}
                >
                  <img src={item.character_icon_url} alt="" />
                </div>
              );
            })}
          </div>
          <div className="character-desc">
            <div className="title">
              {activeCharacterItem[`character_name_${language}`]}
            </div>
            <div className="intro">
              {activeCharacterItem[`character_description_${language}`]}
            </div>
          </div>
        </div>
      </div>
      <div className="mugen-boxes-wapper">
        <div className="mugen-boxes-container">
          <div className="module-title">Mugen Boxes</div>
          <div className="mugen-box-list">
            {boxList
              .concat(Array.from({ length: 3 - boxList.length }).fill(null))
              .map((item: any, i: number) => {
                if (!item) {
                  // return Stay tuned for
                  return (
                    <div
                      className="box-item"
                      key={i}
                      style={{
                        backgroundImage: `url(${require('../../assets/mugen-boxes-stay.png')})`,
                      }}
                    />
                  );
                }
                const selling = item?.blind_box_shelling_status === 1;
                return (
                  <div
                    className={classNames('box-item', {
                      disable: !selling,
                    })}
                    key={i}
                    style={{
                      backgroundImage: `url(${item.box_detail_image_url})`,
                    }}
                  >
                    <div className="desc">
                      <div className="name">{item[`box_name_${language}`]}</div>
                      <div className="series">{item.box_series}</div>
                    </div>
                    <div className="remain">
                      <div className="text">Remaining</div>
                      <div className="num">
                        <span className="available">
                          {item.product_remain}{' '}
                        </span>
                        <span className="all">/ {item.product_total}</span>
                      </div>
                    </div>
                    {selling ? (
                      <Link to={`/mugenBoxes?boxId=${item.id}`}>
                        <div className="buy">Buy Now</div>
                      </Link>
                    ) : (
                      <div className="buy disable">Buy Now</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="special-thanks-warpper">
        <div className="special-thanks-container">
          <div className="module-title">Special Thanks</div>
          <div className="author-list">
            {specialThankList.map((item: any, key: number) => {
              return (
                <div className="item" key={key}>
                  <div className="photo">
                    <img src={item?.creater_header_url} alt="" />
                  </div>
                  <div className="name">{item?.creater_name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
