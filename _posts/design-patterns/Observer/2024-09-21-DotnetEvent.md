---
layout: post
title: "Observer 2. .NET Event Programming"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

> 코드들은 설명을 위한 예제 코드입니다. 오류가 있을 수 있습니다.

이벤트를 설명하는 많은 글들에서 명명을 글마다 다 다르게 해서 이해하기에 굉장히 헷갈립니다. 그 부분을 보완하고자 이번 글에서는 닷넷이 권장하는 이벤트 프로그래밍에 대해 짚어보고자 합니다. 이 글은 [Handling and Raising Events](https://learn.microsoft.com/en-us/dotnet/standard/events/) 를 바탕으로 닷넷이 권장하는 이벤트 프로그래밍 방식을 설명하고자 합니다.

> Events in .NET are based on the delegate model. The delegate model follows the observer design pattern, which enables a subscriber to register with and receive notifications from a provider.

.NET의 이벤트는 **대리자(Delegate) 모델**을 기반으로 합니다. 대리자 모델은 구독자가 공급자를 등록하고 공급자로부터 알림을 수신하는 **관찰자(Observer) 디자인 패턴**을 따릅니다.

## Delegate

> A delegate is a type that holds a reference to a method. A delegate is declared with a signature that shows the return type and parameters for the methods it references, and it can hold references only to methods that match its signature. A delegate is thus equivalent to a type-safe function pointer or a callback.

**Delegate**는 **메서드의 서명을 정의하는 메서드 포인터** 와 동일합니다.

```csharp
public delegate void CustomEventHandler(object sender, EventArgs e);
```

위 코드는 `CustomEventHandler`라는 delegate의 선언 예시입니다. 이 delegate는 **`object sender`와 `EventArgs`**를 파라미터로 받으며, 반환값이 없는 **`void`** 형식의 메서드를 참조할 수 있습니다.

### 델리게이트의 다중 캐스트는 옵저버 패턴의 구독과 구독 취소를 구현

```csharp
observable.StateChanged += observer.HandleStateChanged;
observable.StateChanged -= observer.HandleStateChanged;
```

이처럼 델리게이트에 여러 구독자를 추가 또는 제거할 수 있습니다.

델리게이트는 **다중 캐스트(Multi-cast)**가 가능하며, 이는 옵저버 패턴의 **구독 시스템**과 유사합니다:

```csharp
public void AddObserver(IObserver observer)
{
    observers.Add(observer);
}

public void RemoveObserver(IObserver observer)
{
    observers.Remove(observer);
}
```

### 델리게이트의 `Invoke`는 옵저버 패턴의 알림을 구현

```csharp
StateChanged?.Invoke(this, e);
```

델리게이트의 `Invoke` 메서드는 옵저버 패턴에서 상태변화를 알리는 것과 동일한 역할을 수행합니다. 구독된 모든 메서드를 호출하여 상태 변화를 알립니다. 이는 옵저버에서 이렇게 구현했었습니다:

```csharp
private void Notify()
{
    foreach (var observer in observers)
    {
        observer.Update();
    }
}
```

이상으로 `delegate`가 옵저버 패턴을 전부 구현했다는 점을 알 수 있습니다. 그렇다면 `event` keyword 가 `delegate`를 어떤식으로 사용하는지를 보겠습니다.

## event

> An event is a message sent by an object to signal the occurrence of an action.

> To define an event, use the `event` keyword in the signature of your event class, and specify the type of delegate for the event.

> Typically, to raise an event, you add a method that is marked as `protected` and `virtual`. Name this method `OnEventName`.

`event` 한정자는 **델리게이트의 외부 접근을 제한**하여 외부에서 구독과 구독 취소는 가능하지만, 직접 이벤트를 호출하거나 재할당할 수 없도록 보장합니다. 이를 통해 이벤트 시스템의 안정성이 강화됩니다.

또한 이벤트를 발생시키는 메서드에 `On` 을 붙여서 표현하는게 전형적입니다.

```csharp
public class Observable
{
    public event EventHandler StateChanged;

    public void ChangeState()
    {
        OnStateChanged(EventArgs.Empty);
    }

    protected virtual void OnStateChanged(EventArgs e)
    {
        StateChanged?.Invoke(this, e);
    }

}

class Program
{
    static void Main()
    {
        Observable observable = new Observable();

        EventHandler handler = (sender, e) => Console.WriteLine("Event Triggered");

        observable.StateChanged += handler;

        observable.ChangeState();

        observable.StateChanged -= handler;

        // observable.StateChanged(); // 컴파일 오류
        // observable.StateChanged.Invoke(); // 컴파일 오류
        // observable.StateChanged = null; // 컴파일 오류
    }
}
```

## EventHandler: .NET 이벤트 프로그래밍에서 권장하는 델리게이트

**`EventHandler`**는 .NET에서 **이벤트를 참조하기 위해 권장하는 델리게이트**입니다. 기본적인 형태는 다음과 같습니다:

```csharp
public event EventHandler CustomEvent;
```

**`EventHandler`**는 다음과 같은 델리게이트의 정의를 줄인 것입니다:

```csharp
delegate void CustomHandler(object sender, EventArgs e);
public event CustomHandler CustomEvent;
```

이로 인해 이벤트가 발생한 **주체(sender)**와 **추가적인 이벤트 데이터(e)**를 전달하는 구조를 제공합니다.

또한, **`EventHandler<T>`**는 EventHandler 의 제네릭 버전으로 다양한 이벤트 데이터를 전달할 수 있는 방법을 제공합니다.

```csharp
public event EventHandler<ThresholdReachedEventArgs> ThresholdReached;

public class ThresholdReachedEventArgs : EventArgs
{
    public int Threshold { get; set; }
    public DateTime TimeReached { get; set; }
}
```

위의 **Generic EventHandler**는 다음과 같은 델리게이트의 정의를 줄인 것입니다:

```csharp
delegate void ThresholdReachedHandler(object sender, ThresholdReachedEventArgs e);
public event ThresholdReachedHandler ThresholdReached;
```

## Event handlers in event receiver class

> To respond to an event, you define an event handler method in the event receiver. This method must match the signature of the delegate for the event you're handling.

여기서 말하는 event handler 는 위의 EventHandler 와는 살짝 다릅니다. 만약 observer pattern 포스트를 보셨다면 여기서 말하는 event handler 는 callback 을 뜻한다는 걸 이해하실 겁니다. 닷넷이 해석하는 Event 와 Handler 는, 이벤트는 어떤 행동에 따른 알려질 결과이고 그 이벤트를 sender 클래스에서 EventHandler 를 통해 invoke 됩니다. 그러니까 이미 이벤트를 핸들링 한것이고, 마찬가지로 같은 시그니쳐를 가지는 receiver 클래스의 handler method 또한 event handler 로 볼 수 있다는 겁니다. 이 차이만 이해하신다면 더 헷갈릴 부분은 없습니다.

코드로 설명해보자면,

```csharp
public class Sender
{
    // EventHandler delegate 를 사용한 이벤트 정의
    public event EventHandler StateChanged;

    protected virtual void OnStateChanged(EventArgs e)
    {
        StateChanged?.Invoke(this, e);
    }
}

public class Receiver
{
    // receiver 의 event handler method
    public void HandleStateChanged(object sender, EventArgs e)
    {
        // 프로세스
    }
}
```

## Action과 Func

**`Action`**과 **`Func`**은 델리게이트의 확장형입니다.

```csharp
public event Action<int> ThresholdReached;
```

위 예시는 간단한 형태로 `Action<int>`를 사용한 것입니다. 하지만, 델리게이트를 사용해 다음과 같이 더 명확하게 표현할 수 있습니다:

```csharp
public delegate void Notify(int value);
public event Notify ThresholdReached;
```

이렇게 하면 델리게이트 이름에서 이벤트가 수행하는 역할을 알 수 있게 되어 **가독성**과 **명확성**을 높일 수 있습니다.

## 이벤트는 왜 void 일까? (Func 은 이벤트로 쓰기 부적합합니다.)

이벤트가 일반적으로 **반환값이 없는 `void`**로 정의되는 이유는 **이벤트의 본질**과 관련이 깊습니다.

- **단순한 알림 전달**: 이벤트는 **상태 변화나 특정 동작을 알리기만** 할 뿐, 그에 대한 결과를 기대하지 않기 때문에 반환값을 가질 필요가 없습니다.
- **일대다 관계**: 이벤트는 단순한 알림 기능입니다. 특정 작업을 지시하고 그 결과를 가져오는 명령과는 다릅니다.
- **비동기 처리**: 이벤트는 비동기적으로 처리될 수 있습니다. 만약 여러 반환값이 있다면, 어떤 반환값을 처리해야 할지 모호하고, 비동기 작업의 완료 시점이 불확실합니다.

## 결론

.NET의 이벤트 시스템을 사용한다는 것은 이미 옵저버 패턴을 구현하고 있는 것과 같습니다. 하지만 다른 디자인 패턴들과 달리, .NET의 이벤트 시스템은 옵저버 패턴의 객체 간 관계를 델리게이트를 통해 구현하고 있기 때문에, 이 구조를 직관적으로 이해하기가 처음에는 조금 어려울 수 있습니다.

델리게이트와 **이벤트 한정자(event)**는 옵저버 패턴의 핵심인 상태 변화 알림과 구독자 관리를 더 유연하고 안전하게 처리할 수 있는 도구입니다. 이를 통해 상태 변화와 그에 따른 반응을 깔끔하게 분리하고, 이벤트를 통한 객체 간의 통신을 더욱 효과적으로 만들 수 있습니다.

구현 방식이 다소 차이를 보일 수 있지만, 본질적으로 .NET의 이벤트 시스템은 옵저버 패턴의 구조와 동일한 목적을 지닌다는 점을 이해하는 것이 중요합니다. 이벤트 시스템을 이해하면서 옵저버 패턴을 더욱 깊이 있게 파악하고, 그 유연함과 확장성을 코드에 적용할 수 있기를 바랍니다.
