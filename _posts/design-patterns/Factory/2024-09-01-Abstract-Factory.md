---
layout: post
title: "Abstract Factory : 여러 개의 객체 생성을 관리"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

**Abstract Factory 패턴**은 여러 개의 관련된 객체를 일관성 있게 생성해야 할 때 유용한 디자인 패턴입니다. 이미 여러 개의 팩토리 메서드가 구현되어 있을 때, 이를 하나의 추상화된 팩토리로 통합하는 것이 항상 필요한 것은 아닙니다. 그러나 특정 상황에서는 **Abstract Factory** 패턴을 통해 코드의 일관성을 유지하고, 유지보수성을 향상시킬 수 있습니다.

이번 글에서는 **Abstract Factory** 패턴을 언제 도입해야 하는지에 중점을 두고, 그 필요성에 대해 살펴보겠습니다.

---

## Abstract Factory 패턴 도입을 고려해야 할 상황

1. **관련된 객체들을 함께 사용해야 할 때**
   객체들이 함께 일관성 있게 사용될 필요가 있을 때 **Abstract Factory** 패턴이 유용합니다. 예를 들어, 특정 게임에서 무기와 방어구가 항상 같은 테마나 스타일로 생성되어야 한다면, 하나의 팩토리에서 일관되게 생성하는 것이 좋습니다. 이를 통해 무기와 방어구 간의 통합된 스타일을 유지할 수 있습니다.

2. **코드의 일관성과 유지보수성 향상**
   다양한 모듈이나 클래스에서 객체 생성 로직이 분산되어 있을 경우, **Abstract Factory** 패턴을 도입하여 중앙에서 객체 생성을 관리하면 코드의 일관성이 높아집니다. 중복 코드를 제거하고, 객체 생성과 관련된 모든 로직을 하나의 팩토리로 집중할 수 있습니다.

3. **새로운 객체 군을 쉽게 추가할 필요가 있을 때**
   프로젝트가 확장되거나, 새로운 제품군(객체 그룹)을 쉽게 추가해야 하는 상황에서는 **Abstract Factory** 패턴이 유용합니다. 예를 들어, 새로운 테마의 게임 장비 세트를 추가할 때, 팩토리 메서드만 수정하거나 새로운 팩토리 클래스를 추가하는 방식으로 쉽게 확장할 수 있습니다.

4. **테스트 용이성**
   유닛 테스트에서 다양한 객체 조합을 테스트해야 하는 경우, **Abstract Factory** 패턴을 도입하면 객체 생성에 대한 의존성을 줄이고, 쉽게 모킹하여 테스트할 수 있습니다.

---

## Abstract Factory 패턴이 불필요한 경우

1. **단일 객체 생성만 필요한 경우**
   프로젝트에서 특정 객체 하나만 생성하면 되는 경우라면, **Abstract Factory** 패턴을 도입하는 것은 과도할 수 있습니다. 간단한 **Factory Method**로도 충분합니다.

2. **객체 생성 로직이 단순한 경우**
   객체를 생성하는 과정이 매우 간단하다면, 굳이 복잡한 추상 팩토리 구조를 도입할 필요가 없습니다.

3. **프로젝트의 복잡성을 증가시키고 싶지 않은 경우**
   작은 프로젝트나 단순한 시스템에서는 불필요한 복잡성을 줄이는 것이 더 중요합니다. 추상 팩토리 패턴은 복잡성을 증가시킬 수 있기 때문에, 꼭 필요한 경우에만 도입해야 합니다.

---

## Abstract Factory 패턴 예제

다음 코드는 **Abstract Factory 패턴**을 사용하여 카드와 카드의 효과를 생성하는 예시입니다. **ICardFactory** 인터페이스를 통해 카드와 그 효과를 생성하는 팩토리를 함께 구현합니다.

### 코드 예시

```csharp
public interface ICard
{
    public string Name { get; }
    public int Play();
}

public interface ICardEffect
{
    public string Name { get; }
    public void Play();
}

public interface ICardFactory
{
    ICard CreateCard(CardConfig cardConfig);
    ICardEffect CreateEffect(EffectConfig effectConfig);
}

public class BasicCardFactory : ICardFactory
{
    public ICard CreateCard(CardConfig cardConfig)
    {
        return new BasicCard(cardConfig);
    }

    public ICardEffect CreateEffect(EffectConfig effectConfig)
    {
        return new BasicEffect(effectConfig);
    }
}

public class AdvancedCardFactory : ICardFactory
{
    public ICard CreateCard(CardConfig cardConfig)
    {
        return new AdvancedCard(cardConfig);
    }

    public ICardEffect CreateEffect(EffectConfig effectConfig)
    {
        return new AdvancedEffect(effectConfig);
    }
}
```

### 코드 설명

1. **ICard**와 **ICardEffect**는 카드와 그 효과를 정의하는 인터페이스입니다. 각각 `Play()` 메서드를 가지고 있어, 카드의 능력이나 효과를 사용할 수 있습니다.
2. **ICardFactory**는 카드를 생성하는 추상 팩토리로, `CreateCard`와 `CreateEffect` 메서드를 제공합니다. 이를 통해 다양한 카드를 생성하고, 카드에 맞는 효과를 제공합니다.
3. **BasicCardFactory**와 **AdvancedCardFactory**는 각각 기본 카드와 고급 카드를 생성하는 구체적인 팩토리입니다. 이 팩토리들은 같은 구조를 가지지만, 각기 다른 타입의 객체를 반환합니다.

---

## 팩토리 메서드와의 차이

이미 여러 개의 팩토리 메서드가 구현되어 있다면, 그걸 굳이 추상 팩토리로 묶어야 할 이유는 프로젝트의 복잡성에 따라 달라집니다. **Factory Method**는 단일 객체를 생성하는 데 중점을 두는 반면, **Abstract Factory**는 **관련된 객체 군**을 생성하는 데 적합합니다. 따라서, 만약 여러 객체가 함께 사용되거나 일관성을 유지해야 한다면 **Abstract Factory** 패턴을 도입하는 것이 적절할 수 있습니다.

---

## 결론

**Abstract Factory 패턴**은 관련된 객체들을 일관성 있게 생성하고, 확장성과 유지보수성을 높이는 데 유용한 패턴입니다. 그러나 모든 상황에서 반드시 필요한 것은 아닙니다. 프로젝트의 복잡성, 객체 생성 로직의 요구사항, 유지보수성을 고려해 **Factory Method**와 **Abstract Factory** 패턴을 적절히 선택하는 것이 중요합니다.
