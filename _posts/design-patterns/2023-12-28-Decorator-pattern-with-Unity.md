---
layout: post
title:  "Decorator Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

Decorator 패턴은, Composition 을 어떻게 사용해야 할지를 가장 잘 보여준다.

이 패턴은 어떤 기능을 확장하기 위해 상속이 아닌 더 유연한 방법을 제공해준다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/decorator-uml.png)

## Implementation in Unity

스파이더맨 영화를 보면, 능력에 대해 깨닫는 과정이 있다.

처음의 스파이더맨은 단순히 힘이 강해진 걸 깨닫는다.

그러다가 벽을 탈 수 있는 걸 깨닫고 그 다음은 거미줄을 쏠수 있는 걸 깨닫게 된다.

단순히 상속만으로 위의 스파이더맨을 구현할 수 있지만,

평행세계의 다른 스파이더맨은 벽을 탈 수는 없지만, 독을 사용할 수 있다던가

또다른 스파이더맨은 거미줄을 쏠 수는 없지만, 엄청난 점프를 할 수 있을 수 있다.

이런 경우 단순히 상속만으로 구현하려면 조금 불편해진다.

그런데 스파이더맨 뿐만 아니라 앤트맨 또한 엄청난 점프 능력과 벽을 탈 수 있는 능력이 있게 된다면?

상속으로 구현한 스파이더맨의 능력을 앤트맨에게도 주기 위해서, 코드 중복이 불가피해진다.

이 문제를 조금 Decorator 패턴을 사용해서 풀어보자.

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
using UnityEngine;

namespace Decorator
{
    /// <summary>
    /// The 'Concrete Component' Class
    /// </summary>
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
    /// <summary>
    /// The 'Concrete Decorator' Class
    /// </summary>
    public class PowerUpClimb : PowerUp
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
    /// <summary>
    /// The 'Concrete Decorator' Class
    /// </summary>
    public class PowerUpShootWeb : PowerUp
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
