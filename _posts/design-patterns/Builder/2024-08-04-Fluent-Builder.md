---
layout: post
title:  "Builder 2. Fluent Builder"
author: SWeetJelly
categories: [ c#, design pattern]
image: assets/images/thumbnail.png
toc: true
---

소프트웨어 개발에서 객체의 복잡한 초기화를 어떻게 관리하느냐는 중요한 과제입니다. 많은 속성과 옵션을 가진 객체를 설정하려면 코드가 복잡해질 수 있는데, 이를 해결하는 대표적인 방법이 **Builder**입니다. 이 패턴은 객체 생성 과정을 단계별로 나누어 유연성을 높이면서도 코드의 가독성을 유지합니다. 여기에 **Method Chaining(메서드 체이닝)**을 결합하면 더욱 직관적이고 효율적인 방식으로 객체를 생성할 수 있습니다.

## Fluent Builder : Method Chaining을 더한 Builder

기본 Builder 는 복잡한 객체를 단계별로 설정하고, 최종적으로 `Build()` 메서드를 통해 완성된 객체를 반환하는 방식입니다. Method Chaining은 각 메서드가 객체 자체를 반환하여 연속적인 메서드 호출을 가능하게 합니다. 두 가지를 결합하면 마치 한 문장처럼 객체 설정이 가능해집니다.

예시 코드를 통해 이를 자세히 알아보겠습니다:

```csharp
public class FluentBuilder
{
    private Enemy _enemy = new Enemy();

    public FluentBuilder SetName(string name)
    {
        _enemy.Name = name;
        return this;
    }

    public FluentBuilder SetHealth(int health)
    {
        _enemy.Health = health;
        return this;
    }

    public FluentBuilder SetSpeed(float speed)
    {
        _enemy.Speed = speed;
        return this;
    }

    public FluentBuilder SetIsBoss(bool isBoss)
    {
        _enemy.IsBoss = isBoss;
        return this;
    }

    public Enemy Build()
    {
        return _enemy;
    }
}

public class FluentBuilderOpening
{
    public void BuildEnemy()
    {
        Enemy enemy = new EnemyFluentBuilder()
            .SetName("Goblin")
            .SetHealth(100)
            .SetSpeed(2.5f)
            .SetIsBoss(false)
            .Build();
    }
}
```

위의 예시에서는 FluentBuilder 를 통해 Enemy의 Name, Health, Speed, IsBoss를 설정한 후, `Build()` 메서드를 호출해 완성된 객체를 얻습니다. 설정 단계는 메서드 체이닝으로 연결되어 코드가 간결하고 명확하게 표현됩니다.

## Method Chaining의 주요 장점

### 1. **가독성 향상**

메서드 체이닝을 사용하면 객체 설정에 필요한 모든 정보가 한 줄에 담기므로 코드를 훨씬 쉽게 이해할 수 있습니다. 개발자는 각 객체가 어떻게 설정되는지 한눈에 파악할 수 있어, 복잡한 초기화 과정을 직관적으로 처리할 수 있습니다.

```csharp
Enemy enemy = new Enemy.Builder()
    .SetName("Goblin")
    .SetHealth(100)
    .SetSpeed(1.5f)
    .SetIsBoss(false)
    .Build();
```

위와 같이 체이닝을 사용하면 객체가 어떻게 설정되는지 한 눈에 쉽게 이해할 수 있습니다.

### 2. **코드의 간결함**

각 메서드가 객체 자체를 반환하므로 불필요한 변수 선언이나 반복적인 코드가 줄어듭니다. 메서드 체이닝은 코드를 줄이면서도 동일한 논리를 유지할 수 있도록 도와줍니다.

### 3. **객체의 일관성 유지**

Builder 패턴을 사용하면 설정이 완료되기 전까지 객체에 접근할 수 없으므로, 불완전한 상태의 객체가 생성되는 것을 방지합니다. 체이닝된 빌더 패턴은 객체가 완전한 상태가 될 때까지 외부로 노출되지 않아 일관성을 유지할 수 있습니다.

### 4. **유연성과 확장성**

새로운 설정 메서드를 추가해도 체이닝 구조 덕분에 코드의 흐름이 크게 바뀌지 않습니다. 빌더 패턴은 유지보수가 용이하며, 새로운 옵션을 추가할 때도 자연스럽게 확장할 수 있습니다.

### 5. **에러 방지**

객체를 생성하기 전에 필수적인 설정이 빠졌다면 빌더 패턴은 컴파일 타임에 오류를 방지해줍니다. 메서드 체이닝을 사용하면 `Build()`를 호출하기 전에 필요한 설정이 모두 완료되었는지 쉽게 확인할 수 있습니다.

### 6. **디자인 패턴과의 자연스러운 조화**

메서드 체이닝은 빌더 패턴뿐만 아니라 **Fluent Interface(플루언트 인터페이스)**와 같은 패턴과도 자연스럽게 어우러집니다. 이러한 패턴들은 메서드 체이닝을 사용하여 직관적이고 유연한 API를 제공하므로, 개발자가 더욱 편리하게 사용할 수 있습니다.
