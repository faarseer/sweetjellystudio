---
layout: post
title:  "Mediator Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

Mediator 패턴은 객체들의 interaction 을 encapsulation 를 통해 객체들 간의 커플링을 줄여주는 패턴이다.

OOP 의 특성 상 로직이나 책임을 적절히 분산하고 객체들을 조합해 복잡성을 낮추고 재사용을 높이도록 장려한다.

그러나 한 덩어리에서 여러 덩어리로 분산시키는 행위가 항상 복잡성을 낮춘다고 하기에는 애매하다.

정확히는 객체가 다른 객체와의 연관성이 높아질 수록, 즉 객체의 독립성 자체가 떨어진다면 복잡성은 높아진다.

어떤 객체가 다른 객체에 접근하거나 제어하는 것을 하나의 기능으로서 관리하는 객체를 생성한다면, 즉 객체의 상호작용을 캡슐화한다면, 객체 사이의 결합이 느슨해지고 객체의 상호작용을 독립적으로 다양화할 수 있다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/mediator-uml.png)

## Implementation with Unity

이번에 구현할 것은 중개자 패턴의 범위를 전역접근으로 넓혀 본다. 여러 객체에 대한 전역 접근을 관리하는 객체를 만들어보자.

singleton 의 대안에서 언급했었던 내용인데, 접근해야할 객체가 있다면 가장 간단한 방법은 필요한 객체를 파라미터로 넘겨줄 수 있는지 부터 생각해보는 것이다.

이 방법은 굉장히 쉬울 뿐더러 커플링을 명확하게 보여줄 수 있다.

그러나 객체를 파라미터화 하는 방식이 불필요하거나 디버깅하기 어려워 질 수 있다.

로그나 메모리 관리 같은 시스템이 모듈의 공개 API 에 포함되면 안된다.

또한 렌더링 함수 파라미터에 렌더링과 관계없는 로그 같은 것이 섞여 있는 것 또한 불편하다.

또한 어떤 시스템은 본질적으로 하나뿐이다. > 이러한 객체는 복잡하게 사용할 필요가 없다!

> 서비스 중개자 패턴은 좋은 싱글턴 패턴이다.

## 주의할 점

1. 서비스가 실제로 등록되어 있어야 한다.

싱글턴이나 정적 클래스에서는 인스턴스가 항상 준비되어 있다.(Lazy Instantiation 이든 어떻든 코드를 호출할 때 존재한다는 보장이 되어있다.)

마찬가지로 서비스 중개자 패턴 또한, 서비스를 사용할 때에는 서비스 객체가 등록되어 있다고 보장되어 있어야 한다. 이를 위해 Null Service 를 default 로 등록한다.

2. 서비스는 누가 자기를 가져다 놓는지 모른다. 즉, 서비스는 제공에 관련해서 decoupling 되어있어야 한다.

서비스 중개자 객체가 서비스의 제공과 접근을 관리하기 때문에 서비스 객체에서 어떤 상황에 사용될지 안될지 같은 것에 대한 구현은 없어야 한다.

{% highlight csharp %}
namespace Mediator
{
    /// <summary>
    /// The 'Service' abstract class
    /// </summary>
    public abstract class Service
    {
        public Service()
        {
        }

        public abstract void ProvideService();

        public abstract void StopService();

        public abstract void StopAllServices();
    }

}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Mediator
{
    public class ConcreteService : Service
    {
        public ConcreteService() : base()
        {
        }

        public override void ProvideService()
        {
            Debug.Log("Provide Service");
        }

        public override void StopService()
        {

            Debug.Log("Stop Service");
        }

        public override void StopAllServices()
        {
            Debug.Log("Stop All Services");
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace Mediator
{
    public class Mediator
    {
        private static NullService nullService;
        private static Service service;
        public static Service Service => service;

        private Mediator()
        {
            nullService = new NullService();
            service = nullService;
        }

        public static void Provide(Service _service)
        {
            if(service == null)
            {
                service= nullService;
            }
            else
            {
                service = _service;
            }
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace Mediator
{
    public class NullService : Service
    {
        public NullService() : base()
        {
        }
        public override void ProvideService()
        {}

        public override void StopService()
        {}

        public override void StopAllServices()
        {}
    }
}
{% endhighlight %}

'ProvideService()' 를 호출하는 쪽에서는 Service 라는 추상 클래스만 알 뿐 ConcreteService 라는 구체 클래스에 대해서는 전혀 모른다.

Mediator 클래스 역시 서비스 제공자의 구체 클래스와는 커플링되지 않는다.

어떤 구체 클래스가 사용될지는 초기화 코드 혹은 서비스를 교체하는 곳에서만 알 수 있다.

Service 객체 또한 서비스 중개자를 통해 어디서 접근되는 사실을 모른다. 일반적인 추상 클래스일 뿐이다. 이 점이 '서비스'를 제공하는 클래스의 형태 자체에 영향을 미치는 싱글턴 패턴과 다른 점이다.

{% highlight csharp %}
using UnityEngine;

namespace Mediator
{
    public class MediatorClient : MonoBehaviour
    {
        void Start()
        {
            Mediator mediator = new Mediator();

            ConcreteService service = new ConcreteService();

            Mediator.Provide(service);

            Mediator.Service.ProvideService();

            EnableServiceLog();

            Mediator.Service.ProvideService();
        }

        void EnableServiceLog()
        {
            Service service = new LoggedService(Mediator.Service);
            Mediator.Provide(service);
        }
    }
}
{% endhighlight %}

초기화 코드를 unity 개발방식에 맞게 어셋화 하는 것도 좋은 방법이다.

해당 방법은 singleton with unity 에 어느정도 구현되어 있으므로 한번 보는 것도 좋다.

{% highlight csharp %}
using UnityEngine;

namespace Mediator
{
    public class LoggedService : Service
    {
        private Service wrapped;

        public LoggedService(Service service)
        {
            this.wrapped = service;
        }

        public override ProvideService()
        {
            Debug.Log("Provide Service");
            wrapped.ProvideService();
        }

        public override StopService()
        {
            Debug.Log("Stop Service");
            wrapped.StopService();
        }

        public override StopAllServices()
        {
            Debug.Log("Stop All Services");
            wrapped.StopAllServices();
        }
    }
}
{% endhighlight %}

Logged Service 는 서비스에 데코레이터 패턴을 적용해 로그를 적용하는 방법이다.
