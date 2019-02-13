/**
 * 全局导航跳转工具类 by Micah
 */

export default class NavigationsUtil {

    static goPage(params,page) {
        const navigation = NavigationsUtil.navigation;
        if(!navigation){
            console.log("navigation can not is null")
        }
        navigation.navigate(page,
            {
                ...params
            }
        )
    }

    static goBack(navigation) {
        navigation.goBack();
    }

    /**
     * 重置到首页
     * @param navigation
     */
    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate("Main");
    }
    
}

