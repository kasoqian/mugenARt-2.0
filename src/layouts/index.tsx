import { IRouteComponentProps, Link } from 'umi';
import Header from './components/header';
import OpenBoxesAnimation from './components/open-boxes-animation';
import classNames from 'classnames';
import { MouseEvent, useCallback, useEffect, useState, useMemo } from 'react';
import { setLocale, getLocale } from 'umi';

setLocale('ja-JP', false);

// @ts-ignore
import styles from './index.less';
import { useModel } from '@@/plugin-model/useModel';
import useLocals from '@/hooks/useLocals';
import AppLoading from '@/components/AppLoading';

interface ILink {
  img: string;
  name: string;
  url: string;
  redPoint?: boolean;
}

export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showLanguage, setShowlanguage] = useState<boolean>(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  // state相较于isAppLoaded有1s延迟
  const [isAppLoadedState, setIsAppLoadedState] = useState(false);
  const [chosenLan, setChoseLan] = useState<'english' | 'japan'>('japan');
  const { allBoxesList } = useModel('useMugenBox');
  const { isFixLayout } = useModel('useFixModalScroll');
  const { openAnimationVisible, unityRef } = useModel('useUnity');

  const { localText } = useLocals();

  const links: ILink[] = useMemo(() => {
    const links: ILink[] = [
      {
        img: require('./assets/home.svg'),
        name: localText['home.menu.home'],
        url: '/home',
      },
      {
        img: require('./assets/mugenBoxes.svg'),
        name: localText['home.menu.box'],
        url: '/mugenBoxes',
        redPoint: allBoxesList?.some(
          (item: any) =>
            item.box_type === 'REWARD' && item.user_remain_exchange_times > 0,
        ),
      },
      {
        img: require('./assets/events.svg'),
        name: localText['home.menu.events'],
        url: '/events',
      },
      // {
      //   img: require('./assets/market.svg'),
      //   name: localText('home.menu.market'),
      //   url: '/market',
      // },
      {
        img: require('./assets/about.svg'),
        name: localText['home.menu.about'],
        url: '/about',
      },
    ];
    return links;
  }, [chosenLan, allBoxesList]);

  useEffect(() => {
    document.onreadystatechange = function () {
      if (document.readyState == 'complete') {
        setIsAppLoadedState(true);
        setTimeout(() => {
          setIsAppLoaded(true);
        }, 1000);
      }
    };
  }, []);

  const { setLanguage } = useModel('language', (model) => ({
    language: model.language,
    setLanguage: model.setLanguage,
  }));

  const tabToActive = (link: ILink) => {
    const index = links.findIndex((lin) => link.url === lin.url);
    setCurrentIndex(() => index);
  };

  const toEnglish = (e: MouseEvent<Element, globalThis.MouseEvent>) => {
    e.stopPropagation();
    setLocale('en-US', false);
    setChoseLan(() => 'english');
  };

  const toJapan = (e: MouseEvent<Element, globalThis.MouseEvent>) => {
    e.stopPropagation();
    setLocale('ja-JP', false);
    setChoseLan(() => 'japan');
  };

  useEffect(() => {
    const lan = chosenLan === 'english' ? 'en-US' : 'ja-JP';
    setLanguage(() => (chosenLan === 'english' ? 'en' : 'japan'));
    localStorage.setItem('MUGEN_LANGUAGE', lan);
  }, [chosenLan]);

  useEffect(() => {
    const index = links.findIndex((link) => link.url === location.pathname);
    if (index >= 0) {
      setCurrentIndex(() => index);
    } else {
      setCurrentIndex(() => 0);
    }
    // 路由变化，重置滚动条位置
    document.getElementById('mugen-layout')?.scrollTo?.({
      top: 0,
      left: 0,
    });
  }, [location.pathname]);

  const closeLanguage = useCallback(() => {
    setShowlanguage(() => false);
  }, []);

  useEffect(() => {
    if (showLanguage) {
      document.addEventListener('click', closeLanguage, false);
    } else {
      document.removeEventListener('click', closeLanguage, false);
    }
  }, [showLanguage]);

  return (
    <>
      {isAppLoaded === false && <AppLoading isLoadedState={isAppLoadedState} />}
      <div
        id="mugen-layout"
        className={classNames(styles.layout, {
          [styles['fix-layout']]: isFixLayout,
        })}
      >
        <Header />
        <div className={styles.sidebar}>
          <div className={styles.bg} />
          <div className={styles.tabs}>
            {links.map((link, index) => (
              <Link to={link.url} key={index}>
                <div
                  className={classNames([
                    styles.label,
                    {
                      [styles.active]: currentIndex === index,
                      [styles['red-point']]: link.redPoint,
                    },
                  ])}
                  onClick={() => tabToActive(link)}
                >
                  <img src={link.img} alt="" />
                  <div className={styles.name}>{link.name}</div>
                </div>
              </Link>
            ))}

            <div
              className={styles.language}
              onClick={() => setShowlanguage(() => true)}
            >
              {showLanguage ? (
                <div
                  className={styles.chooseLang}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div
                    className={classNames([
                      styles.english,
                      {
                        [styles.active]: chosenLan === 'english',
                      },
                    ])}
                    onClick={(event) => {
                      toEnglish(event);
                      setShowlanguage(() => false);
                    }}
                  >
                    English
                  </div>
                  <div className={styles.line} />
                  <div
                    className={classNames([
                      styles.japan,
                      {
                        [styles.active]: chosenLan === 'japan',
                      },
                    ])}
                    onClick={(event) => {
                      toJapan(event);
                      setShowlanguage(() => false);
                    }}
                  >
                    日本語
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
        <div
          className={styles.unity}
          style={{
            display: openAnimationVisible ? 'block' : 'none',
          }}
        >
          <OpenBoxesAnimation ref={unityRef} />
        </div>
        <div className={styles.footer}>
          <div className={styles.logo}>
            <div className={styles.rule}>
              <a
                className={styles.privacy}
                href="#/rule/policy"
                target="_blank"
              >
                {localText['home.footer.privacy']}
              </a>
              <a
                className={styles.user}
                href="#/rule/agreement"
                target="_blank"
              >
                {localText['home.footer.agreement']}
              </a>
            </div>
            <img src={require('./assets/logo.png')} alt="" />
            <div className={styles['copy-right']}>© 2021 copyright</div>
            <div className={styles.rule2}>
              <a
                className={styles.icon}
                href="https://www.instagram.com/mugenart.eth/"
                target="_blank"
              >
                <img src={require('./assets/ins.png')} />
              </a>
              <a
                className={styles.icon}
                href="https://discord.com/invite/ZMkNwSuaPg"
                target="_blank"
              >
                <img
                  className={styles.discord}
                  src={require('./assets/doggy.png')}
                />
              </a>
              <a
                className={styles.icon}
                href="https://medium.com/@MugenARt_Closet"
                target="_blank"
              >
                <img src={require('./assets/m.png')} />
              </a>
              <a
                className={styles.icon}
                href="https://twitter.com/MugenARt_Closet"
                target="_blank"
              >
                <img src={require('./assets/twitter.png')} />
              </a>
              <a
                className={styles.icon}
                href="https://note.com/mugenartnft"
                target="_blank"
              >
                <img src={require('./assets/note.png')} />
              </a>
              <a
                className={styles.icon}
                href="https://maghub.notion.site/FAQ-ac931e6e7366427ead6de26103479052"
                target="_blank"
              >
                <img src={require('./assets/notion.png')} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
