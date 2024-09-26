---
layout: post
title: "Visitor 2. Self-Managed Visitor"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

이번 글에서는 내가 이름 붙인 **Self Managed Visitor 패턴**에 대해 설명하려고 합니다. 이 패턴은 전통적인 Visitor 패턴에서 살짝 변형된 방식으로, 실제 코드에서 자주 등장하는 패턴입니다. 특히, **프라이빗 필드를 수정해야 하는 경우**에 이 패턴이 유용합니다.

---

## Self Managed Visitor 패턴이란?

**Self Managed Visitor 패턴**은 전통적인 Visitor 패턴과 달리, 연산 로직이 **Visitor**가 아닌 **Visitable 객체** 내에서 수행되는 패턴입니다. 즉, Visitor가 객체에 방문하여 작업을 지시하면, 구체적인 연산은 해당 객체가 직접 수행합니다. 이를 통해 프라이빗 필드에 직접 접근할 수 있고, 캡슐화된 데이터의 변경을 안전하게 처리할 수 있습니다.

---

## Self Managed Visitor 패턴의 구현

다음은 **Self Managed Visitor 패턴**의 예제 코드입니다. 이 코드에서는 **StatModifier** Visitor가 **HealthComponent**와 **ManaComponent**를 방문하여 각각의 값을 수정하지만, 실제 연산은 각 **Visitable** 객체에서 수행됩니다.

```csharp
public interface IVisitor
{
    void Visit(HealthComponent health);
    void Visit(ManaComponent mana);
}

public interface IVisitable
{
    void Accept(IVisitor visitor);
}

public class StatModifier : IVisitor
{
    private readonly int healthBonus;
    private readonly int manaBonus;

    public StatModifier(int health, int mana)
    {
        healthBonus = health;
        manaBonus = mana;
    }

    public void Visit(HealthComponent health)
    {
        health.Modify(healthBonus);
    }

    public void Visit(ManaComponent mana)
    {
        mana.Modify(manaBonus);
    }
}
```

이 코드에서 **StatModifier**는 **IVisitor** 인터페이스를 구현하여 **HealthComponent**와 **ManaComponent**를 방문하는 역할을 합니다. 그러나 실제로 값을 변경하는 연산은 각 컴포넌트의 `Modify` 메서드를 통해 수행됩니다.

```csharp
public class HealthComponent : IVisitable
{
    private int value;

    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }

    public void Modify(int value)
    {
        this.value += value;
    }
}

public class ManaComponent : IVisitable
{
    private int value;

    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }

    public void Modify(int value)
    {
        this.value += value;
    }
}
```

이 코드에서 **HealthComponent**와 **ManaComponent**는 각각의 `value` 필드를 `Modify` 메서드를 통해 변경합니다. **StatModifier**는 해당 객체가 직접 제공하는 `Modify` 메서드를 호출해 값을 변경하며, 이로써 객체 내의 프라이빗 필드를 안전하게 수정할 수 있습니다.

---

## 코드 설명

이 패턴의 핵심은 **Visitable 객체**가 `Accept` 메서드를 통해 Visitor를 받아들이고, Visitor가 방문할 때 **구체적인 연산**은 해당 객체 내에서 처리된다는 점입니다. 예를 들어, `StatModifier`가 **HealthComponent**를 방문하면 `Modify` 메서드를 호출하여 `value` 필드를 증가시키는 방식입니다. 이는 Visitor 패턴이 연산을 객체에 위임하고, Visitor는 그저 연산을 트리거하는 역할만 한다는 점에서 전통적인 Visitor 패턴과 차이를 보입니다.

---

## Self Managed Visitor 패턴의 장점

1. **캡슐화 유지**  
   이 패턴은 객체의 내부 상태(프라이빗 필드)를 보호하면서도, Visitor 패턴의 장점을 살릴 수 있습니다. 객체가 자신의 상태를 스스로 관리하며, 외부에서 직접적인 접근 없이 안전하게 필드를 수정할 수 있습니다.

2. **연산 로직의 명확성**  
   전통적인 Visitor 패턴에서는 연산 로직이 Visitor 객체에 집중되는 반면, **Self Managed Visitor 패턴**에서는 연산 로직이 각 객체에 분산되어 더 직관적이고 명확해집니다. 객체는 자신의 상태에 대한 연산을 직접 처리하므로, 연산의 의미가 더 명확해집니다.

3. **유연한 확장성**  
   Visitor와 Visitable 객체가 연산을 나누어 처리하기 때문에, 새로운 연산이 추가되더라도 객체의 내부 구조를 변경하지 않고 쉽게 확장할 수 있습니다.

---

## 사실, 연산을 하나의 Visitor 클래스에 집중시키는 점을 포기한 것이다

**Self Managed Visitor 패턴**은 전통적인 Visitor 패턴의 한 가지 주요 장점인 **연산을 하나의 Visitor 클래스에 집중시키는** 점을 일부 포기하게 됩니다. 전통적인 Visitor 패턴에서는 연산 로직이 Visitor 클래스에 모여 있어 여러 객체에 대한 연산을 한 곳에서 관리할 수 있지만, Self Managed Visitor 패턴에서는 연산을 각 객체 내부로 분산시키는 방식이죠.

이로 인해 생길 수 있는 단점이 바로 **연산 로직의 분산**입니다. 각 Visitable 객체가 자신의 연산을 관리하게 되면 코드가 흩어져서, 여러 연산을 한 곳에서 파악하기가 어렵고, 응집도가 낮아질 수 있습니다. 이렇게 되면 연산을 확장하거나 변경할 때, 각 Visitable 객체를 수정해야 하는 상황이 발생할 수 있습니다.

반면, Self Managed Visitor 패턴의 장점은 **객체의 내부 상태 관리**를 안전하게 하면서도, 각 객체가 스스로 자신의 상태를 변경하도록 함으로써 **연산의 명확성**을 제공하는 것입니다. 특히 프라이빗 필드나 상태를 직접 관리해야 할 때 더 적합할 수 있습니다.

결국, 이 패턴이 적합한지 여부는 프로젝트의 요구 사항과 구조에 따라 달라집니다. **Visitor 패턴**이 객체 구조와 연산을 명확하게 분리하고 연산을 중앙 집중화하는 데 중점을 둔다면, **Self Managed Visitor 패턴**은 객체 자체가 연산의 주체가 되면서 더 나은 **캡슐화**와 **상태 관리**를 제공하는 데 중점을 둡니다.

---

## 마무리

**Self Managed Visitor 패턴**은 전통적인 Visitor 패턴의 변형으로, 프라이빗 필드를 직접 수정해야 하는 경우 유용하게 사용할 수 있는 패턴입니다. 연산을 Visitor 객체가 아닌 Visitable 객체 내에서 수행함으로써 캡슐화를 유지하면서도 연산 로직을 보다 명확하게 표현할 수 있습니다. 이 패턴은 특히 객체의 내부 상태를 안전하게 관리해야 하는 경우나, 연산이 각 객체에 따라 다르게 수행되어야 할 때 매우 효과적입니다.
