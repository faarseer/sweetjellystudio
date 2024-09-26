---
layout: post
title: "Decorator 2. Dynamic Decorator"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

**Decorator 패턴**은 객체에 동적으로 기능을 추가할 수 있는 유연한 구조적 디자인 패턴입니다. 기존 Decorator 패턴에서 객체의 결합은 주로 생성자에서 이루어지지만, 이번 글에서 다룰 **Dynamic Decorator 패턴**은 객체와 데코레이터 간의 결합을 런타임에 동적으로 변경할 수 있는 유연한 방법을 사용합니다.

---

## Dynamic Decorator : 생성자에서 Decorate 하지 않아도 된다

**Dynamic Decorator 패턴**은 전통적인 데코레이터 패턴의 변형으로, 데코레이터와 객체 간의 결합을 런타임에 유동적으로 변경할 수 있는 기능을 제공합니다. 이 패턴은 객체 간의 관계를 보다 유연하게 만들고, 런타임에 객체의 기능을 동적으로 확장할 수 있도록 합니다.

1. **동적 결합**  
   전통적인 데코레이터 패턴에서는 객체와 데코레이터가 주로 생성자를 통해 결합됩니다. 그러나 **Dynamic Decorator 패턴**은 `Decorate`와 같은 메서드를 사용해 데코레이터가 데코레이팅할 객체를 런타임에 유연하게 교체할 수 있습니다.

2. **유연한 객체 구성**  
   이 패턴은 객체를 고정된 생성자 기반 결합이 아닌, 런타임에 필요할 때마다 동적으로 구성할 수 있는 유연성을 제공합니다.

---

### Dynamic Decorator 패턴의 구현

**Dynamic Decorator 패턴**은 전통적인 데코레이터 클래스에 동적 결합 메서드를 추가하여 객체와 데코레이터 간의 결합을 유연하게 변경할 수 있도록 합니다.

```csharp
public interface ICard
{
    public string Name { get; }
    public int Play();
}

public class BattleCard : ICard
{
    readonly int value;
    readonly string name;
    public string Name => name;

    public BattleCard(int value, string name)
    {
        this.value = value;
        this.name = name;
    }

    public int Play()
    {
        return value;
    }
}
```

이제 **Dynamic Decorator** 패턴을 적용한 데코레이터 클래스를 살펴보겠습니다:

```csharp
public class CardDecorator : ICard
{
    protected ICard card;
    protected int value;
    protected string name;
    public string Name => name;

    public CardDecorator(int value, string name)
    {
        this.value = value;
        this.name = name;
    }

    // 런타임에 데코레이팅할 객체를 동적으로 설정할 수 있는 메서드
    public void Decorate(ICard card)
    {
        this.card = card;
    }

    public virtual int Play()
    {
        return (card?.Play() ?? 0) + value;
    }
}
```

**CardDecorator** 클래스는 데코레이팅할 객체를 런타임에 동적으로 변경할 수 있는 `Decorate` 메서드를 제공합니다. 이 메서드는 기존 객체를 재사용하면서, 데코레이팅할 대상 객체를 변경할 수 있는 유연성을 부여합니다.

---

### Dynamic Decorator 패턴의 활용

기존의 데코레이터 패턴과 동적 데코레이터 패턴의 차이를 알아보기 위해 두 가지 방식을 비교해보겠습니다.

- **기존 생성자 기반 방식**에서는 데코레이터와 객체 간의 결합이 고정적입니다. 새로운 객체를 데코레이터로 감싸려면 새로운 인스턴스를 생성해야 합니다.

```csharp
ICard card = new BattleCard(10, "Basic Card");
ICard decoratedCard = new CardDecorator(10, "Double Value", card);
```

- **Dynamic Decorator 패턴**에서는 한 번 생성된 데코레이터 객체를 사용하여 다른 객체를 동적으로 감쌀 수 있습니다.

```csharp
ICard card = new BattleCard(10, "Basic Card");
CardDecorator decorator = new CardDecorator(0, "Double Value");

// 첫 번째 카드에 데코레이터 적용
decorator.Decorate(card);

// 나중에 다른 카드로 교체
ICard anotherCard = new BattleCard(20, "Another Card");
decorator.Decorate(anotherCard);
```

동일한 데코레이터 인스턴스를 여러 객체에 재사용할 수 있으며, 런타임에 객체를 동적으로 변경할 수 있습니다.

---

### Dynamic Decorator 패턴의 장점

1. **객체 재사용**  
   Dynamic Decorator 패턴을 사용하면 같은 데코레이터 인스턴스를 재사용하여 여러 객체를 감쌀 수 있습니다. 객체 생성 비용을 줄이고 메모리 효율성을 높일 수 있습니다.

2. **유연성 향상**  
   생성자 방식과 달리 런타임에 객체 간의 결합을 동적으로 변경할 수 있습니다. 객체의 동작을 자유롭게 변경할 수 있는 유연성을 제공합니다.

3. **메모리 사용의 효율성**  
   새로운 객체 인스턴스를 생성하는 대신, 기존 객체를 재사용할 수 있어 메모리 관리 측면에서 효율적입니다.

---

### Dynamic Decorator 패턴의 단점

1. **상태 관리의 복잡성**  
   데코레이터가 참조하는 객체를 런타임에 동적으로 변경할 수 있으므로, 객체의 상태 변화를 신중하게 관리해야 합니다. 참조 변경이 많아지면 코드의 예측 가능성이 떨어질 수 있습니다.

2. **명확성 저하**  
   객체와 데코레이터 간의 동적 관계는 코드를 복잡하게 만들 수 있으며, 코드의 단순성과 명확성이 감소할 수 있습니다.

---

## 결론

**Dynamic Decorator 패턴**은 객체 간의 결합을 동적으로 변경할 수 있는 유연한 디자인 패턴입니다. 이 패턴은 객체의 기능을 동적으로 확장해야 하거나 객체 간의 관계를 유연하게 처리해야 하는 상황에서 특히 유용합니다. 기존 데코레이터 패턴이 제공하는 기능에 비해 메모리 사용 효율성과 객체 재사용 측면에서 더 많은 유연성을 제공합니다.

이 패턴은 런타임에 객체의 동작을 동적으로 변경할 수 있기 때문에, 복잡한 객체 관계를 처리하거나 다양한 조합의 기능을 제공해야 할 때 매우 강력한 도구가 될 수 있습니다.
