---
layout: post
title:  "Adapter Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
featured: true
---

## Intro

### UML

## Implementation in Unity

캐릭터를 display 하는 방법에 대해

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
