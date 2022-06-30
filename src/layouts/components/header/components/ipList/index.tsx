import { getAllIpAndIpCharacter } from '@/api/mugenSeries';
import useLocals from '@/hooks/useLocals';
import { message, Select } from 'antd';
import { useEffect, useState } from 'react';

import './index.less';

const { Option } = Select;

interface IpListProps {
  activeIpId: any;
  setActiveIpId: any;
}

function IpList({ activeIpId, setActiveIpId }: IpListProps) {
  const [serieList, setSerieList] = useState<any>([]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (serieList.length) {
      setActiveIpId(serieList[0]?.id);
    }
  }, [serieList]);

  const load = async () => {
    const res = await getAllIpAndIpCharacter();
    if (res.length === 0) {
      message.error('no data of series');
    }
    setSerieList(res);
  };

  return (
    <div className="altas-ip-select">
      <div className="mugen-ip-list">
        <div className="ip-tab-list">
          <Select
            value={activeIpId}
            onChange={setActiveIpId}
            dropdownClassName="ip-tab-drop-down"
          >
            {serieList.map((item) => {
              return (
                <Option className="option" value={item.id} key={item.id}>
                  {/* {isEnglish ? item.ip_name_en : item.ip_name_japan} */}
                  {item.ip_name_japan}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default IpList;
