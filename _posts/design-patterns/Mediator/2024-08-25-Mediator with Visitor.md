---
layout: post
title: "Mediator 와 Visitor 의 조합 : Visitor 패턴을 활용한 다양한 타입의 데이터 전송"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

이전 **Mediator 패턴** 글에서는 간단한 채팅 시스템을 구축하여 **string** 타입의 메시지를 주고받는 예제를 다뤘습니다. 이번 글에서는 **Visitor 패턴**을 도입하여 다양한 타입의 데이터를 주고받을 수 있는 시스템으로 업그레이드해보려고 합니다. 이를 통해 **Mediator 패턴**과 **Visitor 패턴**의 결합이 얼마나 강력한 조합인지 확인할 수 있습니다.

---

## Visitor 패턴을 Mediator 시스템에 적용하기

**Visitor 패턴**은 객체의 구조는 변경하지 않고, 새로운 연산을 추가하는 데 유용한 디자인 패턴입니다. 이 패턴을 활용하면 다양한 타입의 데이터를 **Mediator** 시스템을 통해 주고받을 수 있습니다.

### 코드 예시

```csharp
public interface IVisitor
{
    void Visit(IVisitable visitable);
}

public abstract class Payload<TPayload> : IVisitor
{
    public abstract TPayload Content {get;}
    public abstract void Visit(IVisitable visitable);

    public Payload(TPayload content)
    {
        this.Content = content;
    }
}

public class StringPayload : Payload<string>
{
    public IVisitable Sender {get;}
    public override string Content {get;}

    public override void Visit(IVisitable visitable)
    {
        // 타입 검사 필요
        if(visitable is Agent agent)
        {
            agent.Receive(Content);
        }
    }

    public StringPayload(IVisitable sender, string content) : base(content)
    {
        this.Sender = sender;
    }
}
```

위 코드는 **Payload** 클래스를 정의해 **Visitor 패턴**의 역할을 수행하게 하고, 이를 통해 **string** 타입의 데이터를 전달하는 **StringPayload** 클래스를 구현한 모습입니다.

---

### Mediator 시스템에 Visitor 패턴 적용

이제 Visitor 패턴을 기반으로 한 **Mediator 시스템**을 구성해보겠습니다. **Entity**와 **Agent** 클래스는 **IVisitable** 인터페이스를 구현하여 **Visitor**가 방문할 수 있도록 합니다.

```csharp
public interface IVisitable
{
    void Accept(IVisitor visitor);
}

public abstract class Entity : IVisitable
{
    protected IMediator mediator;

    public Entity(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public abstract void Accept(IVisitor visitor);
}

public class Agent : Entity
{
    public string Name { get; }

    public Agent(IMediator mediator, string name) : base(mediator)
    {
        this.Name = name;
    }

    public override void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }

    public void Receive(string message)
    {
        Console.WriteLine($"{Name} received message: {message}");
    }

    public void Send(string message)
    {
        Console.WriteLine($"{Name} sends message: {message}");
        mediator.Send(this, new StringPayload(this, message));
    }

    public void Send(IVisitor visitor)
    {
        mediator.Send(this, visitor);
    }
}
```

---

### Mediator 클래스

Mediator 클래스는 메시지를 중재하며, **Visitor 패턴**을 통해 객체 간의 상호작용을 관리합니다.

```csharp
public interface IMediator
{
    void Send(Entity sender, string message);
}

public class Mediator : IMediator
{
    private List<Entity> entities = new List<Entity>();

    public void Register(Entity entity)
    {
        entities.Add(entity);
    }

    public void Send(Entity sender, IVisitor visitor)
    {
        foreach (var entity in entities)
        {
            if (entity != sender)
            {
                entity.Accept(visitor);
            }
        }
    }
}
```

---

### 시스템 실행

```csharp
class MediatorOpening
{
    void Start()
    {
        Mediator mediator = new Mediator();

        Agent alice = new Agent(mediator, "Alice");
        Agent bob = new Agent(mediator, "Bob");
        Agent charlie = new Agent(mediator, "Charlie");

        mediator.Register(alice);
        mediator.Register(bob);
        mediator.Register(charlie);

        alice.Send("Hello everyone!");
        bob.Send("Hi Alice!");
    }
}
```

---

## Generic 기반의 Visitor Mediator 시스템

위에서 구현한 **Mediator 시스템**은 다양한 타입의 데이터를 처리할 수 있지만, **타입 안정성**에 취약한 부분이 있습니다. 이를 해결하기 위해 **Generic 기반**의 Mediator 시스템으로 업그레이드할 수 있습니다. **Generic Mediator**는 더 강력한 타입 검사를 통해 **런타임 에러**를 줄이고, 더 명확한 구조를 제공합니다.

```csharp
public interface IVisitor<T> where T : IVisitable
{
    void Visit(T visitable);
}

public abstract class Payload<TPayload, T> : IVisitor<T> where T : IVisitable
{
    public abstract TPayload Content {get;}
    public abstract void Visit(T visitable);
}

public class StringPayload : Payload<string, Agent>
{
    public Agent Sender {get;}
    public override string Content {get;}

    public StringPayload(Agent sender, string content)
    {
        this.Sender = sender;
        this.Content = content;
    }

    public override void Visit(Agent visitable)
    {
        visitable.Receive(Content);
    }
}
```

이제 **Mediator** 클래스도 제네릭으로 설계하여, 특정 타입에만 Mediator 시스템을 적용할 수 있습니다.

```csharp
public abstract class Mediator<T>
{
    protected readonly List<T> entities = new();

    public void Register(T entity)
    {
        entities.Add(entity);
    }

    public abstract void Send(T sender, IVisitor visitor);
}

public class AgentMediator : Mediator<Agent>
{
    public override void Send(Agent sender, IVisitor visitor)
    {
        foreach(var entity in entities)
        {
            if(!entity.Equals(sender))
            {
                entity.Accept(visitor);
            }
        }
    }
}
```

또한, Agent 클래스는 Agent 타입의 Mediator 와 상호작용할 수 있도록 구성합니다.

```csharp
public interface IVisitable
{
    void Accept(IVisitor visitor);
}

public class Agent : IVisitable
{
    public string Name {get;}
    Mediator<Agent> mediator;

    public Agent(Mediator<Agent> mediator, string name)
    {
        this.Name = name;
        this.mediator = mediator;
    }

    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }
    public void Receive(string message)
    {
        Console.WriteLine($"{Name} received message: {message}");
    }

    public void Send(IVisitor visitor)
    {
        mediator.Send(this, visitor);
    }

    public void Send(string message)
    {
        Console.WriteLine($"{Name} sends message: {message}");
        mediator.Send(new StringPayload(this, message));
    }
}
```

---

## 두 버전의 차이점

1. **설계 방식의 차이**  
   - 첫 번째 버전은 **인터페이스 기반**으로 더 높은 유연성을 제공하며, 다양한 엔티티가 상호작용할 수 있습니다.
   - 두 번째 버전은 **제네릭**을 사용해 더 강력한 타입 안정성을 제공합니다.

2. **유연성 대 타입 안전성**  
   - 인터페이스 기반 설계는 여러 타입을 다룰 수 있는 유연성을 제공하지만, 런타임 타입 검사로 인해 복잡성이 증가할 수 있습니다.
   - 제네릭 기반 설계는 **컴파일 타임**에 타입 안정성을 보장하여, 더 안전한 코드를 작성할 수 있습니다.

3. **확장성과 유지보수성**  
   - 인터페이스 기반은 다양한 엔티티를 처리할 수 있는 확장성이 있지만, 타입마다 새로운 메서드를 구현해야 하는 부담이 있습니다.
   - 제네릭 기반은 더 안전하지만, 특정 타입에 한정되어 유연성이 떨어질 수 있습니다.

---

## 그럼에도 interface 기반의 코드 작성은 설계 단계에서 쓸만하다

### 1. **유연한 설계 및 빠른 변경**

- 인터페이스 기반 설계는 **구체적인 구현**을 강제하지 않기 때문에, **유연하게 여러 타입**의 객체를 다룰 수 있습니다. 이를 통해 프로토타입 단계에서 **다양한 시나리오**를 실험하고, 변경이 필요한 부분을 쉽게 수정할 수 있습니다.
- 예를 들어, `IVisitable`, `IVisitor` 같은 인터페이스는 다양한 객체들이 서로 **동적 관계**를 형성할 수 있도록 하여, 초기 설계에서 기능과 구조를 자유롭게 조정할 수 있습니다.

### 2. **구현 클래스 변경 용이성**

- 인터페이스 기반 설계는 객체의 **구현 클래스를 교체**하는 것이 매우 쉽습니다. 즉, 특정 객체가 상호작용하는 방식이나 내부 동작을 쉽게 수정하거나 교체할 수 있기 때문에, **여러 가지 방식을 실험**하고 테스트하기에 적합합니다.
- 예를 들어, `IMediator` 인터페이스를 기반으로 다양한 Mediator 구현 클래스를 만들고, 실시간으로 이 구현 클래스들을 바꾸면서 성능이나 구조의 적합성을 평가할 수 있습니다.

### 3. **기능 확장 테스트에 유리**

- 프로토타입에서는 종종 새로운 기능을 추가하거나, 기존 기능을 확장하는 요구가 발생합니다. 인터페이스 기반의 설계는 **기능 추가가 용이**하며, 다른 객체들과의 상호작용을 빠르게 시도해볼 수 있습니다.
- 각 객체가 인터페이스만을 참조하기 때문에, **구체적인 구현에 의존하지 않아** 다양한 방식으로 확장 테스트가 가능합니다.

### 4. **코드가 직관적이고 단순**

- 인터페이스 기반 설계는 일반적으로 **단순하고 직관적**이기 때문에 프로토타입 작성 시 빠르게 구조를 잡고, 기능을 구현할 수 있습니다.
- **런타임 타입 검사**나 **유연한 객체 처리**를 통해 구조를 빠르게 잡을 수 있으므로, 전체 시스템의 큰 틀을 구성하는 데 유리합니다.

### 5. **복잡성 증가 요소를 나중에 도입 가능**

- 초기에는 **타입 안정성**이나 **구체적인 구현의 복잡성**을 고려하지 않고, 인터페이스 기반으로 전체 구조와 기본적인 흐름을 빠르게 잡을 수 있습니다.
- 이후 실제 프로젝트로 전환하거나 프로토타입을 다듬는 과정에서 **타입 안전성을 강화**하기 위해 Generic 방식으로 전환하거나, **타입 검사를 줄이는 방향**으로 개선할 수 있습니다.

## 마무리

두 버전 모두 각각의 장단점이 있으며, **인터페이스 기반**은 더 유연한 설계를 제공하지만, **제네릭 기반**은 더 안전하고 간결한 코드를 작성할 수 있게 합니다. 타입 안정성을 보장하고자 할 때는 **제네릭 기반**의 **Mediator** 설계가 적합하며, 설계 단계나 다양한 객체 간의 상호작용이 필요한 경우에는 **인터페이스 기반**이 더 유리할 수 있습니다.
