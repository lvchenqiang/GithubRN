/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "RNUMConfigure.h"
#import "UMAnalytics/MobClick.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNUMConfigure.h"
#import "Constants.h"
#import <UMShare/UMShare.h>

#import "RNSplashScreen.h"  // here

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
    [self initUmeng];
  
  NSURL *jsCodeLocation;

  
//                #ifdef DEBUG
//                    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//                #else
                    jsCodeLocation = [CodePush bundleURL];
//                #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"GithubRN"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
   [RNSplashScreen show];  // here
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
    // 其他如支付等SDK的回调
  }
  return result;
}
-(void)initUmeng{
  //UMeng 统计
  [MobClick setScenarioType:E_UM_NORMAL];
  [UMConfigure setLogEnabled:YES];
  [RNUMConfigure initWithAppkey:UM_AppKey channel:UM_ChannelId];
}
@end
