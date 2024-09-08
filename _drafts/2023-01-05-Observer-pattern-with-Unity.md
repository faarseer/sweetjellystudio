---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

## Introduction

옵저버 패턴은 객체 간의 통신을 용이하게 하는 기본 디자인 패턴 중 하나입니다. Unity 같은 게임 개발 환경에서도 이 패턴은 여러 컴포넌트 간의 상태 변경과 상호작용을 관리하는 것을 크게 단순화할 수 있습니다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/observer-uml.png)

- Subject
  - knows its observers. Any number of Observer objects may observe a subject
  - provides an interface for attaching and detaching Observer objects
- ConcreteSubject
  - stores state of interest to ConcreteObserver
    - sends a notification to its observers when its state changes
- Observer
  - defines an updating interface for objects that should be notified of changes in a subject
- ConcreteObserver
  - maintains a reference to a ConcreteSubject object
  - stores state that should stay consistent with subject's
  - implements the Observer updating interface to keep its state consistent with the subject's

## Difference between Observer pattern and Publisher-Subscriber pattern

옵저버 패턴과 publisher-subscriber 패턴은 종종 디자인 패턴에서 혼용되어 사용되지만, 명확하게 다른 점이 있습니다.

1. 옵저버 패턴 : 이 패턴은 객체 간에 직접적인 관계를 설정하며, 옵저버는 관찰 대상(주체)을 알고 있습니다. 관찰 대상의 상태가 변경되면, 모든 등록된 옵저버에게 직접 알립니다. 상세하게는, 옵저버는 일반적으로 업데이트된 상태를 주체로부터 묻기 때문에 조금 더 밀접하게 연결되어 있다고 할 수 있습니다.

2. Publisher-Subscriber 패턴 : 이 패턴은 옵저버 패턴을 확장해 브로커 또는 메시지 큐 시스템(C#에서의 이벤트 핸들러)을 퍼블리셔(관찰 대상)와 Subscriber(옵저버) 사이에 추가합니다. 이 중개자는 메시지 또는 이벤트 통신과 배포를 처리하며, Subscriber 가 퍼블리셔의 정체를 알 필요가 없도록 함으로써 유연성과 확장성을 높였다고 할 수 있습니다.

코드로 비교해봅시다.

---

{% highlight csharp %}
using System;
using System.Collections.Generic;

namespace Observer
{
    public class NotificationProvider : IObservable<CustomEvent>
    {
        public string ProviderName {get; private set;}
        private List<IObserver<CustomEvent>> m_observers;

        public NotificationProvider(string _providerName)
        {
            ProviderName = _providerName;
            m_observers = new List<IObserver<CustomEvent>>();
        }
        
        public IDisposable Subscribe(IObserver<CustomEvent> observer)
        {
            if(!m_observers.Contains(observer))
            {
                m_observers.Add(observer);
            }
            return new Unsubscriber(m_observers, observer);
        }

        public void EventNotification(string description)
        {
            foreach(var observer in m_observers)
            {
                observer.OnNext(new CustomEvent(ProviderName, description, DateTime.Now));
            }
        }
        private class Unsubscriber : IDisposable
        {
            private List<IObserver<CustomEvent>> m_observers;
            private IObserver<CustomEvent> m_observer;

            public Unsubscriber(List<IObserver<CustomEvent>> _observers, IObserver<CustomEvent> _observer)
            {
                this.m_observers = _observers;
                this.m_observer = _observer;
            }

            public void Dispose()
            {
                if(!(m_observer == null))
                {
                    m_observers.Remove(m_observer);
                }
            }
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using System;

namespace Observer
{
    public class NotificationSubscriber : IObserver<CustomEvent>
    {
        public string SubscriberName {get; private set;}
        private IDisposable m_unsubscriber;

        public NotificationSubscriber(string _subscriberName)
        {
            SubscriberName = _subscriberName;
        }

        public virtual void Subscribe(IObservable<CustomEvent> provider)
        {
            if(provider != null)
            {
                m_unsubscriber = provider.Subscribe(this);
            }
        }

        public virtual void OnCompleted()
        {
            Console.WriteLine("DONE");
        }

        public virtual void OnError(Exception e)
        {
            Console.WriteLine($"Error {e.Message}");
        }

        public virtual void OnNext(CustomEvent ev)
        {
            Console.WriteLine($"Hey {SubscriberName} -> you received {ev.EventProviderName} {ev.Description} @ {ev.Date}");
        }

        public virtual void UnSubscribe()
        {
            m_unsubscriber.Dispose();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using System;

namespace Observer
{
    public class CustomEvent
    {
        public string EventProviderName {get;set;}
        public string Description {get;set;}
        public DateTime Date {get;set;}

        public CustomEvent(string _eventProviderName, string _description, DateTime _date)
        {
            EventProviderName = _eventProviderName;
            Description = _description;
            Date = _date;
        }
    }
}
{% endhighlight %}

코드에서 확인할 수 있듯이, Observable 클래스는 Observer 와 associated 관계에 있으며, 반대로는 dependency 가 존재한다. 이렇듯 두 클래스 간의 커플링이 존재하는데, c# event 를 구현하면서 event handler 라는 mediator 를 통해 두 클래스 간의 커플링을 해결한다.

아래는 c# event 의 예시 코드이다.

{% highlight csharp %}
using System;

namespace DotNetEvents
{
    // Define a class to hold custom event info
    public class CustomEventArgs : EventArgs
    {
        public CustomEventArgs(string message)
        {
            Message = message;
        }

        public string Message { get; set; }
    }

    // Class that publishes an event
    class Publisher
    {
        // Declare the event using EventHandler<T>
        public event EventHandler<CustomEventArgs> RaiseCustomEvent;

        public void DoSomething()
        {
            // Write some code that does something useful here
            // then raise the event. You can also raise an event
            // before you execute a block of code.
            OnRaiseCustomEvent(new CustomEventArgs("Event triggered"));
        }

        // Wrap event invocations inside a protected virtual method
        // to allow derived classes to override the event invocation behavior
        protected virtual void OnRaiseCustomEvent(CustomEventArgs e)
        {
            // Make a temporary copy of the event to avoid possibility of
            // a race condition if the last subscriber unsubscribes
            // immediately after the null check and before the event is raised.
            EventHandler<CustomEventArgs> raiseEvent = RaiseCustomEvent;

            // Event will be null if there are no subscribers
            if (raiseEvent != null)
            {
                // Format the string to send inside the CustomEventArgs parameter
                e.Message += $" at {DateTime.Now}";

                // Call to raise the event.
                raiseEvent(this, e);
            }
        }
    }

    //Class that subscribes to an event
    class Subscriber
    {
        private readonly string _id;

        public Subscriber(string id, Publisher pub)
        {
            _id = id;

            // Subscribe to the event
            pub.RaiseCustomEvent += HandleCustomEvent;
        }

        // Define what actions to take when the event is raised.
        void HandleCustomEvent(object sender, CustomEventArgs e)
        {
            Console.WriteLine($"{_id} received this message: {e.Message}");
        }
    }

    class Program
    {
        static void Main()
        {
            var pub = new Publisher();
            var sub1 = new Subscriber("sub1", pub);
            var sub2 = new Subscriber("sub2", pub);

            // Call the method that raises the event.
            pub.DoSomething();

            // Keep the console window open
            Console.WriteLine("Press any key to continue...");
            Console.ReadLine();
        }
    }
}
{% endhighlight %}

해당 코드에서 볼 수 있듯이 publisher는 eventhandler를 제공함으로써 subscriber 의 존재는 알 수 없는 것을 확인할 수 있다.

## Implement C# Event with Unity

간단한 업적 시스템을 만들어봅시다.

레벨 완료나 보스 처치와 같은 다양한 게임 동작이 업적을 트리거하는 간단한 업적 시스템을 구성해봅시다. Unity 와 C# event 를 사용해 이러한 트리거를 효과적으로 관리하고 관련 UI 컴포넌트가 적절히 업데이트되도록 알림을 받을 수 있습니다.

Unity 에서의 기본 설정은 다음과 같습니다:

1. 업적 관리자 : 업적이 잠금 해제될때 감지하는 로직을 처리합니다.
2. UI 관리자 : 업적 관리자에 구독하고 새 업적에 대한 알림을 받을 때 UI를 업데이트 합니다.

이 설정은 각 구성 요소가 기능을 수행하는 데 필요한 정보만큼만 알도록 해 최소 지식 원칙을 준수합니다.

{% highlight csharp %}
using System;
using System.Collections.Generic;

namespace ObserverPatternExample
{
    public class AchievementSystem
    {
        public event EventHandler<AchievementEventArgs> OnAchievementUnlocked;

        protected virtual void NotifyAchievementUnlocked(AchievementEventArgs e)
        {
            OnAchievementUnlocked?.Invoke(this, e);
        }

        public void UnlockAchievement(string achievementName)
        {
            Console.WriteLine($"Achievement unlocked: {achievementName}");
            NotifyAchievementUnlocked(new AchievementEventArgs(achievementName));
        }
    }

    public class AchievementEventArgs : EventArgs
    {
        public string AchievementName { get; }

        public AchievementEventArgs(string name)
        {
            AchievementName = name;
        }
    }

    public class UIAchievementNotifier
    {
        public void Subscribe(AchievementSystem system)
        {
            system.OnAchievementUnlocked += OnAchievementUnlocked;
        }

        private void OnAchievementUnlocked(object sender, AchievementEventArgs e)
        {
            Console.WriteLine($"Notification: Achievement '{e.AchievementName}' unlocked!");
        }
    }
}
{% endhighlight %}

---

## Conclusion

Unity 에서 C# event 를 활용한 디자인 패턴은 유연하고 유지 관리가 가능한 게임 아키텍처를 개발하는 데 좋은 도구입니다. 개발자는 반응성이 높고 결합이 느슨한 시스템을 만들 수 있으며, 코드 베이스를 관리하고 확장하기가 더 쉬워집니다.
