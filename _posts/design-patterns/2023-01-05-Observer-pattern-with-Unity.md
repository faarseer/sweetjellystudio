---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

옵저버 기본 > 펍서브패턴 > c# event 설명 > 유니티 이벤트 > 유니티에서 이벤트 사용방식

예시 : 업적시스템 > UI 간단

Observer pattern 은 어떤 객체의 상태 변화를 다른 객체들이 인지하고 작용할 수 있도록 하는 패턴이다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/observer-uml.png)

c# 에서는 이를 event 에서 구현하고 있는데, c# event 의 publisher, subscriber 방식과 기존의 observable, observer 에 약간의 차이점이 있다.

c# event 의 publisher, subscriber 방식은 기존의 observer 패턴에 event handler 라는 mediator 를 추가함으로써 observable과 observer 간에 de-coupling 을 적용했다고 할 수 있다.

예시코드를 보면 이해하기 편하다.

---

아래는 observer pattern 예시 코드다.

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

해당 코드에서 볼 수 있듯이 publisher는 eventhandler를 제공함으로써 subscriber 의 존재는 알 수 없는 것을 확인할 수 있다. subscriber 는 publisher 에 dependency 가 남아있지만 publisher 의 event 를 잘 처리한다면 해결가능한 부분이다.

## Implement with Unity

이제 유니티 event 를 들여다보자.

기본 유니티 이벤트 설명 ...

유니티 이벤트 방식을 적용한 커스텀 이벤트 코드 설명

업적시스템.

업적 종류가 많아지면서 달성 방법 또한 다양해진다.

ref

https://dev.to/absjabed/publisher-subscriber-vs-observer-pattern-with-c-3gpc

https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/

유니티 이벤트 api 레퍼런스

---
