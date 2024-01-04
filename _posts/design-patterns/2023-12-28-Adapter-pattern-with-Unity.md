---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

Adapter 패턴은, 호환되지 않는 클래스를 변형없이 사용하기 위해 호환하는 클래스를 목적에 맞게 변형하는 패턴이다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/adapter-uml.png)

## Implementation in Unity

캐릭터는 여러 곳에서 다른 정보를 보여줘야 한다.

만약 상점이라면, 캐릭터를 사는 결정을 도와줄 정보들을 보여줘야 한다.

예를 들어, 가격은 확실히 상점에서 보여줘야 할 캐릭터 정보다.

만약 전투 상황에 캐릭터의 정보를 보게 된다면, 이 때는 전투 상황에 맞는 캐릭터의 정보를 보고 싶을 것이다.

예를 들어, DPS는 전투 중에 확인하고 싶은 캐릭터 정보일 것이다.

이렇게 캐릭터라는 객체는 여러 곳에서 display 되면서 같은 값을 보여주지 않고 상황에 맞는 값을 보여줘야 된다.

그러나 그 때마다 캐릭터-상점, 캐릭터-전투 이렇게 여러 개의 객체를 만드는 것은 비효율적이다.

캐릭터 객체를 두고 display 하는 클래스를 상황에 맞게 바꾸는 Adapter 패턴을 사용해 위의 상황을 구현해보자.

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
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Adapter
{
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
