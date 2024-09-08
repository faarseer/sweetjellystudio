---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/DesignPatterns/adapter-thumbnail.png
---

## Introduction

게임 개발에서 플레이어의 경험을 향상시키는 측면에서의 도전 과제는 매력적인 게임 플레이를 만드는 것뿐만 아니라, 정보를 잘 제시하는 것에도 있다. 어댑터 패턴은 이러한 시스템을 만드는데에 좋은 방법이 될 수 있다. 추가적인 수정 없이 호환되지 않는 클래스를 함께 사용할 수 있게 해주기 때문이다. 이 디자인 패턴은 다리 역할을 해 직접 호환되지 않아도 서로 다른 요소들이 함께 작동할 수 있도록 해준다.

어댑터 패턴은 서로 호환되지 않는 인터페이스를 가진 객체들이 협력할 수 있게 하는 구조적 디자인 패턴이다. 한 나라의 기기를 다른 나라의 콘센트에서 원활하게 작동하게 하는 전원 어댑터처럼 생각해보는 것이 제일 쉽겠다. 마찬가지로, 소프트웨어 개발에서 어댑터 패턴은 클래스의 인터페이스를 기존의 클래스를 수정하지 않으면서 클라이언트가 기대하는 다른 인터페이스로 변환해주는 것이다. 이 패턴은 특히 Unity 에서 외부 API, 레거시 시스템을 다루거나, 더 깨끗하고 모듈화된 아키텍쳐를 목표로 할 때 유용하다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/adapter-uml.png)

## Implementation in Unity

상점과 전투 시나리오와 같은 다양한 컨텍스트에서 중요한 역할을 하는 게임의 캐릭터를 생각해보자. 각각의 컨텍스트에서 캐릭터의 다른 측면을 보여줘야 한다. 예를 들어 상점에서는 캐릭터를 사는 결정을 도와줄 정보들, 대표적으로 가격을 보여줘야 한다. 그러나 전투 상황에서 캐릭터의 정보를 확인해야 한다면, 전투 상황에 맞는 캐릭터의 정보를 보고 싶을 것이다. DPS 같은 것들이 되겠다. 그렇지만 각 컨텍스트마다 여러 캐릭터 객체를 생성하는 것은 비효율적인 접근 방식이다. 대신, 우리는 어댑터 패턴을 사용해 단일 캐릭터 객체를 다른 컨텍스트의 디스플레이 요구 사항에 동적으로 적응시킬 수 있다.

1. 'Adaptee' : 이 클래스는 다양한 속성을 가진 우리의 캐릭터를 나타낸다. 우리가 다른 디스플레이 컨텍스트에 적응시키고자 하는 클래스가 된다.

{% highlight csharp %}
namespace Adapter
{
    /// <summary>
    /// The 'Adaptee' Class
    /// </summary>
    public class Character
    {
        private string name;
        public string Name => name;
        private float dps;
        public float Dps => dps;
        private int price;
        public int Price => price;

        public Character(string name, float dps, int price)
        {
            this.name = name;
            this.dps = dps;
            this.price = price;
        }
    }
}
{% endhighlight %}

2. 'Adapter' : 특정 디스플레이 어댑터에 대한 베이스 클래스 역할을 한다. 캐릭터 디스플레이를 위한 일반적인 인터페이스를 제공한다.

{% highlight csharp %}
namespace CommandPattern
using UnityEngine;

namespace Adapter
{
    /// <summary>
    /// The 'Adapter' Class
    /// </summary>
    public class CharacterDisplay
    {
        public virtual void Display()
        {
            Debug.Log("Character yet assigned");
        }
    }
}
{% endhighlight %}

3. 'Concrete Adatper' : 이 클래스들은 'Character' 클래스를 특정 디스플레이 컨텍스트에 맞게 적응시킨다.

{% highlight csharp %}
using UnityEngine;

namespace Adapter
{
    /// <summary>
    /// The 'Concrete Adapter' Class, implements 'Battle Display'
    /// </summary>
    public class CharacterBattleDisplay: CharacterDisplay
    {
        public Character character;

        public CharacterBattleDisplay(Character character)
        {
            this.character= character;
        }

        public override void Display()
        {
            Debug.Log($"Name : {character.Name} | DPS : {character.Dps} ");
        }
    }

    /// <summary>
    /// The 'Concrete Adapter' Class, implements 'Shop Display'
    /// </summary>
    public class CharacterShopDisplay: CharacterDisplay
    {
        public Character character;

        public CharacterShopDisplay(Character character)
        {
            this.character= character;
        }

        public override void Display()
        {
            Debug.Log($"Name : {character.Name} | Price: {character.Price} Gold");
        }
    }
}
{% endhighlight %}

## Conclusion

어댑터 패턴은 Unity 개발자의 강력한 도구이다. 다양한 게임 컨텍스트에서 캐릭터 정보를 동적으로 디스플레이할 수 있는 유연성을 제공한다. 이 패턴을 사용함으로써 게임의 아키텍쳐를 보다 효율적이고 중복을 줄이며 전반적인 플레이어 경험을 향상시켜보자.
