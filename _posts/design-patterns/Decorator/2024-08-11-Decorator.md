---
layout: post
title: "Decorator"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

소프트웨어 개발에서 객체에 새로운 기능을 추가하고 싶을 때, 기존 클래스를 수정하거나 상속을 사용하는 것이 일반적인 방법입니다. 그러나 이러한 방식은 코드의 유연성을 저하시킬 수 있고, 특히 상속을 남발할 경우 유지보수가 어려워질 수 있습니다. 이러한 문제를 해결하는 **Decorator 패턴**은 객체에 동적으로 새로운 기능을 추가할 수 있도록 해주는 구조적 디자인 패턴입니다.

이번 글에서는 **Decorator 패턴**의 개념과 구현 방법, 그리고 이를 통해 코드의 유연성을 높이는 방법을 살펴보겠습니다.

---

### Decorator 패턴이란?

**Decorator 패턴**은 객체의 기능을 동적으로 확장할 수 있는 방법을 제공합니다. 상속을 사용하지 않고도 런타임에 새로운 기능을 추가할 수 있기 때문에, 클래스의 수정 없이도 객체의 동작을 변경하거나 확장할 수 있습니다.

---

### Decorator 패턴의 주요 특징

1. **유연성**  
   Decorator를 사용하면 기존 클래스를 수정하지 않고도 객체에 다양한 기능을 조합하여 추가할 수 있습니다. 이를 통해 코드의 유연성을 크게 높일 수 있습니다.

2. **단일 책임 원칙(Single Responsibility Principle)**  
   각 Decorator는 특정 기능 추가에만 집중할 수 있어, 클래스의 책임을 분리하고 더 명확하게 관리할 수 있습니다.

3. **개방/폐쇄 원칙(Open/Closed Principle)**  
   Decorator 패턴은 클래스의 코드를 수정하지 않고 기능을 확장할 수 있도록 해줍니다. 기존 코드를 변경할 필요 없이 새로운 기능을 추가할 수 있습니다.

---

### Code Smell: Decorator 패턴이 필요한 순간

Decorator 패턴은 **Feature Envy**나 **God Object** 같은 **Code Smell**을 해결할 때 특히 유용합니다.

- **Feature Envy**  
  한 클래스가 다른 클래스의 데이터를 지나치게 참조하거나 사용하는 경우, 이는 **Feature Envy**라 불리며 코드의 구조를 복잡하게 만듭니다. Decorator 패턴을 사용해 이러한 기능을 별도의 클래스에 분리하면 문제를 해결할 수 있습니다.

- **God Object**  
  하나의 클래스가 너무 많은 책임을 가지게 되면 **God Object**가 되어 코드가 비대해지고 유지보수가 어려워집니다. Decorator를 사용해 책임을 여러 Decorator 클래스로 분리할 수 있습니다.

---

### Decorator 패턴 구현

아래 코드는 **Decorator 패턴**을 사용해 카드를 다루는 간단한 예시입니다. 기본적인 **BattleCard** 클래스에 새로운 기능을 동적으로 추가하여 카드의 능력치를 변경할 수 있습니다.

```csharp
public interface ICard
{
    public string Name {get;}
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

위 코드는 간단한 카드 객체로, `Play()` 메서드를 통해 해당 카드의 능력치를 반환합니다. 이제 이 카드를 확장할 **Decorator** 클래스를 만들어보겠습니다.

```csharp
public class CardDecorator : ICard
{
    protected ICard card;
    
    protected int value;
    protected string name;
    public string Name => name;

    public CardDecorator(int value, string name, ICard card)
    {
        this.value = value;
        this.name = name;
        this.card = card;
    }

    public virtual int Play()
    {
        return (card?.Play() ?? 0 ) + value;
    }
}
```

**CardDecorator** 클래스는 기존 카드에 기능을 추가하기 위한 기본 클래스로, 상속받은 `Play()` 메서드를 통해 기존 카드의 능력치에 새로운 값을 더할 수 있습니다. 여기서, 더 구체적인 데코레이터 클래스를 만들어 보겠습니다.

```csharp
public class DoubleValue : CardDecorator
{
    public DoubleValue(ICard card, string name) : base(0, name, card)
    {}

    public override int Play()
    {
        return card?.Play() * 2 ?? 0;
    }
}
```

**DoubleValue**는 카드의 값을 두 배로 늘리는 역할을 합니다. 이제 이 데코레이터를 사용해 카드를 확장해 보겠습니다.

---

### Decorator 패턴의 활용

Decorator 패턴을 실제로 어떻게 활용하는지 간단한 예시를 통해 살펴보겠습니다.

```csharp
public class DecoratorOpening
{
    void Play()
    {
        ICard card = new BattleCard(10, "Basic BattleCard");

        // 카드에 DoubleValue 데코레이터 적용
        ICard doubleValue = new DoubleValue(card, "Double Value");

        // 카드에 또 다른 DoubleValue 데코레이터 중첩 적용
        ICard doubleValue2 = new DoubleValue(doubleValue, "Double Value");

        doubleValue2.Play();
    }
}
```

이 코드에서는 `BattleCard` 객체를 생성한 후, **DoubleValue** 데코레이터를 통해 해당 카드의 능력치를 두 배로 늘렸습니다. 데코레이터를 중첩하여 여러 번 적용하는 것도 가능합니다.

또 다른 카드에 적용해보는 예시입니다:

```csharp
public void Play2()
{
    ICard basicBattleCard = new BattleCard(10, "Basic BattleCard");
    ICard superiorBattleCard = new BattleCard(20, "Sup BattleCard");

    // 기본 카드에 DoubleValue 적용
    ICard doubleValue = new DoubleValue(basicBattleCard, "Double Value");
    doubleValue.Play();

    // 다른 카드에 DoubleValue 적용
    ICard doubleValue2 = new DoubleValue(superiorBattleCard, "Double Value");
    doubleValue2.Play();
}
```

이처럼 **Decorator 패턴**을 사용하면 여러 카드에 기능을 동적으로 추가할 수 있으며, 각 데코레이터는 서로 독립적이기 때문에 다양한 조합이 가능합니다.

---

### 마무리

**Decorator 패턴**은 객체의 기능을 동적으로 확장할 수 있는 강력한 도구입니다. 상속을 사용하지 않으면서도 런타임에 기능을 추가하거나 변경할 수 있어, 코드의 유연성을 크게 높일 수 있습니다. 특히 **Feature Envy**나 **God Object**와 같은 **Code Smell**을 해결하는 데 매우 효과적입니다.

이 패턴을 활용하면 기존 코드를 수정하지 않고도 새로운 기능을 추가할 수 있어, 유지보수와 확장성 면에서 큰 장점을 제공합니다. Decorator 패턴을 통해 코드를 더 유연하게 관리하고, 객체의 동작을 더 세밀하게 제어해보세요!