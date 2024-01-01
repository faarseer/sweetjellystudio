---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

서로 맞지 않는 인터페이스를 연결해주는 것을 캡슐화한 것이다.

이미 결정된 인터페이스끼리 연결되어 작동중인 어플리케이션에서 호환되지 않은 인터페티이스를 가진 클래스를 쓰기 위해 호환되는 인터페이스와 호환되지 않는 인터페이스도 사용할 수 있게 해주는 것.

@startuml

class Client

interface Target
{
    + Request()
}

class Adapter {
    - adaptee
    + Request()
}

class Adaptee {
    + AdaptedRequest()
}

hide empty members

Target <- Client
Target <|-- Adapter
Adapter -> Adaptee

@enduml

## Implementation in Unity

캐릭터 객체를 여러 곳에 display 하는 방법을 Adapter 패턴으로 구현해보자

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

기본적인 adapter class, display 종류를 subclass 로 구현

{% highlight csharp %}
namespace CommandPattern
using UnityEngine;

namespace Adapter
{
    /// <summary>
    /// The 'Target' Class
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

battle display 구현

{% highlight csharp %}
using UnityEngine;

namespace Adapter
{
    /// <summary>
    /// The 'Adapter' Class implements 'Battle Display'
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

shop display 구현

{% highlight csharp %}
using UnityEngine;

namespace Adapter
{
    /// <summary>
    /// The 'Adapter' Class implements 'Shop Display'
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
