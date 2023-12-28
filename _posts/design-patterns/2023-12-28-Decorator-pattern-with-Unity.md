---
layout: post
title:  "Decorator Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
featured: true
---

## Intro

## Implementation in Unity

캐릭터를 display 하는 방법에 대해

{% highlight csharp %}
namespace Decorator
{
    /// <summary>
    /// The 'Component' Class
    /// </summary>
    public abstract class Hero
    {
        protected string name;

        public abstract void Power();
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace Decorator
{
    /// <summary>
    /// The 'Decorator' Class
    /// </summary>
    public abstract class PowerUp : Hero
    {
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Decorator
{
    public class Spiderman : Hero
    {
        public Spiderman(string name)
        {
            this.name = name;
        }

        public override void Power()
        {
            Debug.Log("Spider Normal Power");
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Decorator
{
    public class PowerUpClimb :PowerUp
    {
        private Hero hero;

        public PowerUpClimb(Hero hero)
        {
            this.hero = hero;
        }

        public override void Power()
        {
            Debug.Log("Power : Climb");
            hero.Power();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Decorator
{
    public class PowerUpShootWeb:PowerUp
    {
        private Hero hero;

        public PowerUpShootWeb(Hero hero)
        {
            this.hero = hero;
        }

        public override void Power()
        {
            Debug.Log("Power : Shoot Web");
            hero.Power();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Decorator
{
    public class Client : MonoBehaviour
    {
        void Start()
        {
            Hero hero = new Spiderman("Player1");

            hero.Power();

            Debug.Log("ADD NEW POWER!");

            hero = new PowerUpClimb(hero);

            hero.Power();

            Debug.Log("ADD NEW POWER!");

            hero = new PowerUpShootWeb(hero);

            hero.Power();
        }
    }
}
{% endhighlight %}