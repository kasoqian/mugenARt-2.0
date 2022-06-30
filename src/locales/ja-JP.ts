import { jaEventsEarn } from './components/events/earn';
import { jaCountDown } from './components/home/countDown';
import { jaBoxIntro as jaHomeBoxIntro } from './components/home/boxIntro';
import { jaJoinUs } from './components/home/joinUs';
import { jaBindEmail } from './components/dialog/bindEmail';
import { jaHashPalette } from './components/dialog/hashpalette';
import { jaLoggedIn } from './components/dialog/LoggedIn';
import { jaResetPassWord } from './components/dialog/resetPassword';
import { jaSignChoose } from './components/dialog/signChoose';
import { jaSignIn } from './components/dialog/signIn';
import { jaSignUp } from './components/dialog/signUp';
import { jaAbout } from './components/home/about';
import { jaMessage } from './components/message';
import { jaUserBar } from './components/user/bar';
import { jaUserSetting } from './components/user/setting';
import { jaBoxIntro } from './components/mugenBox/intro';
import { jaAssetDetail } from './components/asset';
import { jaPartners } from './components/home/partners';
import { jaHomeMenu } from './components/home/menu';
import { jaHomeFooter } from './components/home/footer';
import { jaBoxBuy } from './components/mugenBox/buy';
import { jaUserShare } from './components/user/share';
import { jaVerifyInput } from './components/components/verifyInput';
import { jaEventsTabs } from './components/events/tabs';
import { jaEventsActivities } from './components/events/activities';
import { jaEventsPay } from './components/events/pay';

export default {
  ...jaBindEmail,
  ...jaHashPalette,
  ...jaLoggedIn,
  ...jaResetPassWord,
  ...jaSignIn,
  ...jaSignChoose,
  ...jaSignUp,
  ...jaMessage,
  ...jaUserSetting,
  ...jaUserBar,
  ...jaAbout,
  ...jaJoinUs,
  ...jaCountDown,
  ...jaHomeBoxIntro,
  ...jaAssetDetail,
  ...jaPartners,
  ...jaHomeMenu,
  ...jaHomeFooter,
  ...jaBoxIntro,
  ...jaBoxBuy,
  ...jaUserShare,
  ...jaVerifyInput,
  ...jaEventsTabs,
  ...jaEventsEarn,
  ...jaEventsActivities,
  ...jaEventsPay,
};
