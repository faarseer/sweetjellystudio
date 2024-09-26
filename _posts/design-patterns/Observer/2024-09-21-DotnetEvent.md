---
layout: post
title: "Observer 2. .NET Event Programming"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

.NET의 이벤트는 **대리자(Delegate) 모델**을 기반으로 합니다. 대리자 모델은 구독자가 공급자를 등록하고 공급자로부터 알림을 수신하는 데 사용할 수 있는 **관찰자(Observer) 디자인 패턴**을 따릅니다.

## Delegate

**Delegate**는 **메서드의 서명을 정의하는 메서드 포인터**로, 특정 형식의 메서드를 참조하는 객체입니다. 이를 통해 메서드를 동적으로 호출하거나 변경할 수 있습니다.

```csharp
public delegate void CustomEventHandler(object sender, EventArgs e);
```

위 코드는 `CustomEventHandler`라는 delegate의 선언 예시입니다. 이 delegate는 **`object sender`와 `EventArgs`**를 파라미터로 받으며, 반환값이 없는 **`void`** 형식의 메서드를 참조할 수 있습니다.

### 델리게이트의 다중 캐스트는 옵저버 패턴의 구독과 구독 취소를 구현

```csharp
observable.SimpleHappened += observer.Callback;
observable.SimpleHappened -= observer.Callback;
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

### 델리게이트의 `Invoke`는 옵저버 패턴의 전달을 구현

```csharp
SimpleHappened?.Invoke(this, EventArgs.Empty);
```

델리게이트의 **`Invoke`** 메서드는 옵저버 패턴에서 상태변화를 전달하는 것과 동일한 역할을 수행합니다. 구독된 모든 메서드를 호출하여 상태 변화를 알립니다. 이는 옵저버에서 이렇게 구현했었습니다:

```csharp
private void Invoke()
{
    foreach (var observer in observers)
    {
        observer.Callback();
    }
}
```

## event 한정자

`event` 한정자는 **델리게이트의 외부 접근을 제한**하여 외부에서 구독과 구독 취소는 가능하지만, 직접 이벤트를 호출하거나 재할당할 수 없도록 보장합니다. 이를 통해 이벤트 시스템의 안정성이 강화됩니다.

```csharp
public class Observable
{
    public event EventHandler SimpleHappened = delegate { };
}

class Program
{
    static void Main()
    {
        Observable observable = new Observable();

        observable.SimpleHappened += (sender, e) => Console.WriteLine("Event Triggered!");
        observable.SimpleHappened -= (sender, e) => Console.WriteLine("Event Unsubscribed!");

        // observable.SimpleHappened(); // 컴파일 오류
        // observable.SimpleHappened.Invoke(); // 컴파일 오류

        // observable.SimpleHappened = null; // 컴파일 오류
    }
}
```

## EventHandler: .NET 이벤트 프로그래밍에서 권장하는 델리게이트

**`EventHandler`**는 .NET에서 **이벤트를 처리하는 표준적인 방식**으로 권장됩니다. 기본적인 형태는 다음과 같습니다:

```csharp
public event EventHandler CustomEvent;
```

**`EventHandler`**는

```csharp
delegate void CustomHandler(object sender, EventArgs e);
public event CustomHandler CustomEvent;
```

를 줄인 것과 같습니다. 이로 인해 이벤트가 발생한 **주체(sender)**와 **추가적인 이벤트 데이터(e)**를 전달하는 구조를 제공합니다. 이 방식은 객체 간의 통신을 단순화하면서도, 상태 변화에 대한 구체적인 정보를 함께 전달하는 유연함을 가지고 있습니다.

또한, **`EventHandler<T>`**는 EventHandler 의 제네릭 버전으로 다양한 이벤트 데이터를 전달할 수 있는 방법을 제공합니다.

```csharp
public event EventHandler<ThresholdReachedEventArgs> ThresholdReached;

public class ThresholdReachedEventArgs : EventArgs
{
    public int Threshold { get; set; }
}
```

위의 **제네릭 EventHandler**는

```csharp
delegate void CustomHandler(object sender, ThresholdReachedEventArgs e);
public event CustomHandler ThresholdReached;
```

와 같습니다.

## Action과 Func의 사용

**`Action`**과 **`Func`**은 델리게이트의 확장형으로 간단한 이벤트를 만들 때 자주 사용됩니다. 하지만, **명시적으로 델리게이트를 정의**하는 것이 코드의 가독성을 높이고, 해당 핸들러가 어떤 역할을 수행하는지 프로그래밍 시에 알 수 있습니다.

```csharp
public event Action<int> ThresholdReached;
```

위 예시는 간단한 형태로 `Action<int>`를 사용한 것입니다. 하지만, 델리게이트를 사용해 다음과 같이 더 명확하게 표현할 수 있습니다:

```csharp
public delegate void Notify(int value);
public event Notify ThresholdReached;
```

이렇게 하면 델리게이트 이름 자체에서 이벤트가 수행하는 역할을 알 수 있게 되어 **가독성**과 **명확성**을 높일 수 있습니다.

## 이벤트는 왜 void 일까?

이벤트가 일반적으로 **반환값이 없는 `void`**로 정의되는 이유는 **이벤트의 본질**과 관련이 깊습니다.

- **단순한 알림 전달**: 이벤트는 **상태 변화나 특정 동작을 알리기만** 할 뿐, 그에 대한 결과를 기대하지 않기 때문에 반환값을 가질 필요가 없습니다.
- **일대다 관계**: 이벤트는 단순한 알림 기능입니다. 특정 작업을 지시하고 그 결과를 가져오는 명령과는 다릅니다.

그렇기에 이벤트가 비동기적으로 처리될 수 있기도 한겁니다. 만약 반환값이 있고 그걸 어떤 처리를 해야한다면, 여러 반환값 중 어떤 반환값을 처리해야할지도 감이 오지 않지만, 각각의 작업이 언제 끝날지 모르는 상황에서 어떤 반환값을 처리해야할지도 알수가 없습니다.

## 결론

.NET의 이벤트 시스템을 사용한다는 것은 이미 옵저버 패턴을 구현하고 있는 것과 같습니다. 하지만 다른 디자인 패턴들과 달리, .NET의 이벤트 시스템은 옵저버 패턴의 객체 간 관계를 델리게이트를 통해 구현하고 있기 때문에, 이 구조를 직관적으로 이해하기가 처음에는 조금 어려울 수 있습니다.

델리게이트와 **이벤트 한정자(event)**는 옵저버 패턴의 핵심인 상태 변화 알림과 구독자 관리를 더 유연하고 안전하게 처리할 수 있는 도구입니다. 이를 통해 상태 변화와 그에 따른 반응을 깔끔하게 분리하고, 이벤트를 통한 객체 간의 통신을 더욱 효과적으로 만들 수 있습니다.

구현 방식이 다소 차이를 보일 수 있지만, 본질적으로 .NET의 이벤트 시스템은 옵저버 패턴의 구조와 동일한 목적을 지닌다는 점을 이해하는 것이 중요합니다. 이벤트 시스템을 이해하면서 옵저버 패턴을 더욱 깊이 있게 파악하고, 그 유연함과 확장성을 코드에 적용할 수 있기를 바랍니다.
