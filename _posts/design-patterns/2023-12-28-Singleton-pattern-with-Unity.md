---
layout: post
title:  "Singleton Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
featured: true
---

## Intro

### UML

@startuml Singleton

class Singleton {
    - instance
    - Singleton() : Constructor
    + Instance()
}

@enduml

## 주의할 점

1. 클래스가 꼭 필요한가?

애매하게 다른 객체 관리용으로만 존재하는 '관리자' 역할을 하고 있는가? > 'Manager', 'System', 'Engine' 등으로 생각되는 개념을 singleton 으로 구현하고 있는가.

객체란 독립적으로 작동할 수 있으며 스스로 하나의 기능을 담당할 수 있어야 한다.

만약 singleton 이 어떤 클래스의 기능을 도와주는 경우로 작성한 경우라면 작동 코드는 해당 클래스로 옮기는 것이 맞다.

2. 오직 한개의 인스턴스

singleton 은 두가지 기능이 더해져 있다. 첫번째는 오직 한개의 인스턴스이며 두번째는 전역 접근이 가능하다 라는 점이다.
오직 한개의 인스턴스만 강요하고 싶을 경우 singleton 이어야 하는지 생각해보라.

3. 인스턴스에 쉽게 접근할 수 있다.

전역 접근이 가능하다. 즉, 쉽게 접근이 가능하다는 것이다. 그러나 이 점은 원치 않는 곳에서의 접근 또한 허용한다.

'노출' 범위를 잘 설정해야 한다. 노출 범위가 적을수록 머릿속에 담아둬야 할 범위가 줄어든다!

- Dependency Injection

함수의 파라미터로서 객체를 넘겨주는 것은 싱글턴을 대체할 수 있는 일반적인 경우이다. 그러나 렌더링 관련한 함수들을 작성하는데 렌더링과 관계업는 Log 객체를 같이 param 으로 사용하는 것은 좋지 않다.

- Subclass Sandbox

상속받은 객체가 상위클래스로부터 받은 protected method 를 활용해 구현하는 것도 singleton 을 대체할 수 있는 방법이다.

- 전역인 객체에 aggregation 을 주는 방법

Log, Audio, Player, SaveManager 등 많은 객체를 전역 객체로 바꾸는 것보다 Game 이라는 전체 게임을 관리하는 전역 객체가 있다면 Game을 통해 접근가능하게 바꿔주는 것 또한 하나의 방법이다.

- Mediator 를 통한 해결

여러 객체에 대한 전역 접근을 제공하는 용도로 사용하는 객체를 따로 사용하는 것 또한 singleton 을 대신할 수 있다.

## With Unity

### MonoBehaviour 를 상속하는 Singleton pattern

싱글톤 방식을 MonoBehaviour 에 어떻게 적용할 것인가

MonoBehaviour 는 기존의 객체 인스턴스 방식인 Contructor method를 사용하지 않도록 한다. 컴포넌트 방식와 중개자 방식을 차용한 유니티 방식의 인스턴스 flow를 따라야 한다.

그렇기 때문에 초기화모듈을 따로 구성해 유니티 방식에 맞는 인스턴스 방식을 구현하고 singleton monobehaviour 에는 일부 기능만 구현하도록 한다.

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    /// <summary>
    /// singleton monobehaviour
    /// </summary>
    public class ConcreteSingleton : MonoBehaviour
    {
        private static ConcreteSingleton instance;

        private void Awake()
        {
            if(instance == null)
            {
                instance = this;

                DontDestroyOnLoad(gameObject);
            }
        }

        public void Init()
        {
            Debug.Log("Concrete Singleton Init");
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    /// <summary>
    /// Singleton 의 생성 및 초기화 클래스 > SO 이기 때문에 asset 으로 컨트롤 가능
    /// </summary>
    [CreateAssetMenu(fileName = "Concrete Singleton Init Module", menuName = "Settings/Concrete Singleton Init Module")]
    public class ConcreteSingletonInitModule : InitModule
    {
        public override void CreateComponent(InitController initController)
        {
            ConcreteSingleton singleton = initController.gameObject.AddComponent<ConcreteSingleton>();

            singleton.Init();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    /// <summary>
    /// 'InitModule' 추상화 클래스
    /// </summary>
    public abstract class InitModule : ScriptableObject
    {
        public abstract void CreateComponent(InitController initController);
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    /// <summary>
    /// singleton 의 module asset 들을 통틀어 관리
    /// </summary>
    [CreateAssetMenu(fileName = "Init Settings", menuName = "Settings/Init Settings")]
    public class InitSettings : ScriptableObject
    {
        [SerializeField]
        InitModule[] initModules;

        public void Init(InitController initController)
        {
            for(int i=0;i<initModules.Length;i++)
            {
                initModules[i].CreateComponent(initController);
            }
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    [DefaultExecutionOrder(-512)]
    /// <summary>
    /// Singleton Class 의 초기화를 담당
    /// </summary>
    public class InitController : MonoBehaviour
    {
        [SerializeField]
        InitSettings initSettings;

        void Awake()
        {
            DontDestroyOnLoad(gameObject);

            initSettings.Init(this);
        }
    }
}
{% endhighlight %}
