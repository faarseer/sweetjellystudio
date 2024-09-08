---
layout: post
title:  "Step Builder"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

빌더 패턴은 객체를 단계적으로 설정하는 방법으로 객체의 복잡한 초기화 과정을 단순화해줍니다. 앞서 살펴본 **Fluent Builder** 패턴은 객체 설정 과정을 자연스럽게 이어가면서도 가독성을 높이는 장점이 있습니다. 그러나 이 방식에도 한계가 있습니다. 바로 객체 설정 과정에서 잘못된 순서로 메서드를 호출할 위험이 있다는 점입니다.

이를 방지하기 위해 **Step Builder** 패턴은 인터페이스를 사용하여 객체 생성 단계를 강제함으로써 더욱 견고한 코드를 작성할 수 있게 해줍니다.

## Step Builder 패턴: 생성 단계를 강제하는 Builder

Step Builder 는 객체의 설정 순서를 강제하는 디자인 패턴입니다. 이는 각 설정 단계를 별도의 인터페이스로 분리하여, 특정 단계가 완료되기 전에는 다음 단계로 넘어갈 수 없도록 합니다. 이 방식을 사용하면 잘못된 순서로 메서드가 호출되는 것을 방지하고, 객체 생성 과정을 더욱 안전하게 관리할 수 있습니다.

아래 코드를 통해 Step Builder 의 구조와 동작 방식을 확인해보겠습니다:

```csharp
namespace Builder.Step
{
    public interface IEnemyBuilder
    {
        IHealthBuilder SetName(string name);
    }

    public interface IHealthBuilder
    {
        ISpeedBuilder SetHealth(int health);
    }

    public interface ISpeedBuilder
    {
        IIsBossBuilder SetSpeed(float speed);
    }

    public interface IIsBossBuilder
    {
        IFinalBuilder SetIsBoss(bool isBoss);
    }

    public interface IFinalBuilder
    {
        Enemy Build();
    }

    public class StepBuilder : IEnemyBuilder, IHealthBuilder, ISpeedBuilder, IIsBossBuilder, IFinalBuilder
    {
        private Enemy _enemy = new Enemy();

        public IHealthBuilder SetName(string name)
        {
            _enemy.Name = name;
            return this;
        }

        public ISpeedBuilder SetHealth(int health)
        {
            _enemy.Health = health;
            return this;
        }

        public IIsBossBuilder SetSpeed(float speed)
        {
            _enemy.Speed = speed;
            return this;
        }

        public IFinalBuilder SetIsBoss(bool isBoss)
        {
            _enemy.IsBoss = isBoss;
            return this;
        }

        public Enemy Build()
        {
            return _enemy;
        }
    }
}
```

## Step Builder 패턴의 주요 장점

### 1. **단계 강제**

Step Builder 패턴의 가장 큰 장점은 객체 생성의 각 단계를 강제할 수 있다는 점입니다. 위 예시에서 볼 수 있듯이, `SetName()`을 호출한 후에는 반드시 `SetHealth()` 메서드를 호출해야만 하며, 이 순서를 무시할 수 없습니다. 이로 인해 개발자가 객체 설정의 정확한 순서를 유지할 수 있고, 실수로 메서드를 잘못된 순서로 호출하는 것을 방지할 수 있습니다.

### 2. **유지보수성 향상**

Step Builder 패턴은 각 설정 단계를 인터페이스로 분리하여 객체 생성 과정이 명확하게 구조화됩니다. 이는 코드의 유지보수성을 크게 향상시킵니다. 객체의 설정 단계가 잘 정의되어 있어 코드가 직관적이며, 수정 시에도 각 단계를 따로 수정할 수 있어 더 유연하게 대응할 수 있습니다.

### 3. **확장성**

Step Builder 패턴은 새로운 빌드 단계나 설정 항목을 추가하기에 매우 용이합니다. 만약 객체의 새로운 속성을 추가하고자 할 때, 그에 맞는 새로운 인터페이스를 추가하면 쉽게 확장할 수 있습니다. 기존 단계들에 영향을 주지 않으면서도 유연하게 객체를 설정할 수 있어 유지보수와 확장성 측면에서 매우 강력한 장점을 가집니다.

## Step Builder 패턴의 활용 예시

이 패턴은 특히 **복잡한 객체 생성**이 필요할 때 매우 유용합니다. 예를 들어, 게임 캐릭터나 다양한 속성을 가진 상품 객체 등을 생성할 때 Step Builder 패턴을 사용하면, 생성 과정에서 발생할 수 있는 실수를 최소화하고 명확한 구조로 객체를 정의할 수 있습니다.

다음은 Step Builder 패턴을 통해 Goblin 캐릭터를 생성하는 간단한 예시입니다:

```csharp
Enemy enemy = new StepBuilder()
    .SetName("Goblin")
    .SetHealth(100)
    .SetSpeed(2.5f)
    .SetIsBoss(false)
    .Build();
```

이 코드는 각 설정 단계가 인터페이스로 강제되기 때문에 잘못된 순서로 메서드를 호출하는 것이 불가능하며, 객체 생성이 완료될 때까지 모든 단계가 올바르게 실행되도록 보장합니다.

## Step Builder 패턴과 Director 클래스

객체 생성을 더 유연하게 제어하고자 할 때 **Director** 클래스를 함께 사용하는 방법도 있습니다. **Director**는 객체의 빌드 과정을 중앙에서 관리하며, 미리 정의된 구성을 통해 일관된 객체를 생성할 수 있도록 도와줍니다.

```csharp
public class Director
{
    private StepBuilder builder;

    public Director(StepBuilder builder)
    {
        this.builder = builder;
    }

    public Enemy CreateGoblin()
    {
        return builder
            .SetName("Goblin")
            .SetHealth(100)
            .SetSpeed(2.5f)
            .SetIsBoss(false)
            .Build();
    }
}
```

위 `Director` 클래스는 `StepBuilder`를 통해 특정 설정을 반복해서 사용할 수 있도록 합니다. 예를 들어, Goblin 캐릭터를 생성하는 과정을 `Director`가 관리해주므로 코드의 재사용성과 일관성이 크게 향상됩니다.

## 마무리

Step Builder 패턴은 객체 생성 단계를 명확히 정의하고, 각 단계의 순서를 강제함으로써 보다 안전하고 유지보수 가능한 코드를 작성할 수 있게 도와줍니다. 인터페이스를 통한 단계적 강제는 객체 생성 과정에서 발생할 수 있는 실수를 방지하며, 코드의 확장성과 유연성을 보장합니다. 특히 복잡한 설정이 필요한 객체를 다룰 때 Step Builder 패턴은 매우 효과적인 솔루션이 될 수 있습니다.
