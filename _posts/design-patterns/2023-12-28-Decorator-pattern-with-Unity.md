---
layout: post
title:  "Decorator Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/DesignPatterns/decorator-thumbnail.png
---

게임 개발에서, Decorator 패턴은 코드의 유연성을 최대로 활용한 패턴이라고 할 수 있다. 기존 코드를 변경하지 않고도 기능을 향상시킬 수 있는 이 디자인 패턴은 게임 기능을 원활하게 확장하고 스케일링하고자 하는 개발자들에게 필수적일 것이다. 이제까지와 마찬가지로 Decorator 패턴의 개념에 대한 간단한 설명과 함께 유니티에서 어떻게 활용하면 좋을지에 대해 구현해보자.

## Introduction

Decorator 패턴은, Inheritance 보다 Composition 의 힘을 가장 잘 보여주는 패턴이라고 할 수 있다. 객체 기능을 확장할 수 있는 방법들에서 상속보다도 더 유연한 방법을 제공하는 Decorator 패턴은 상속이 고정적이고 경직된 구조들로 이어질 수 있는 반면에 이 패턴을 사용해 새로운 요구 사항에 쉽게 적응하고 동적으로 추가할 수 있도록 해준다.

![]({{ site.baseurl }}/assets/images/DesignPatterns/decorator-uml.png)

## Implementation in Unity

스토리 라인이 진행됨에 따라 새로운 능력을 발견하고 업그레이드하는 캐릭터를 가진 게임을 개발한다고 상상해보자. 상속을 통해 코딩된 능력들은 창의성과 유연성을 제한하게 된다. 그러나 데코레이터 패턴으로 같은 내용의 구조를 만든다면 조금 더 유연하고 창의적인 구조를 만들 수 있다.

### 스파이더맨

스파이더맨 영화를 보면, 능력에 대해 깨닫는 과정이 있다. 처음의 스파이더맨은 단순히 힘이 강해진 걸 깨닫는다. 그러다가 벽을 탈 수 있는 걸 깨닫고 그 다음은 웹 슈팅을 깨닫게 된다. 이는 마치 스토리 전개에 따라 새로운 능력을 발견하고 발전하는 게임 캐릭터의 성장 과정과 같다.

단순히 상속만으로 위의 스파이더맨을 구현할 수 있지만, 스파이더맨 어크로스 더 유니버스를 보고나면 다양한 평행세계의 다른 스파이더맨들이 벽을 탈 수는 없지만, 독을 사용할 수 있다던가 또다른 스파이더맨은 거미줄을 쏠 수는 없지만, 엄청난 점프를 할 수 있다던가, 혹은 전기를 발산할 수 있다던가 등의 A는 공통이지만 B는 공통이 아니고, C는 새로운 능력 등의 같은 스파이더맨이지만 조금씩 다른 능력을 가진 스파이더맨들을 보게 된다. 이들을 하나하나 상속으로 구현하려고 하면, 엄청난 코드 중복이 생긴다던가, 혹은 일부의 하위 클래스에서는 사용하지 않는 코드를 상위 클래스에 포함해야 할 것이다.

이 문제를 Decorator 패턴을 사용해서 풀어보자.

1. 'Component' 클래스 : 이 추상 클래스는 필수 기능을 가진 Hero 를 모두 정의하며, 동적으로 확장할 수 있도록 했다.

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

2. 'Concrete Component' : 'Spiderman' 클래스는 'Hero' 로 부터 상속받으며, 기본 능력으로 시작한다.

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

3. 'Decorator' : 'Hero'를 확장하는 추상 클래스로, 새로운 능력을 추가하기 위한 기반을 마련해준다.

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

4. 'Concrete Decorator' : 이 클래스들은 'Spiderman'에게 추가될 수 있는 새로운 능력들을 나타내준다.

    {% highlight csharp %}
    using UnityEngine;

    namespace Decorator
    {
        /// <summary>
        /// The 'Concrete Decorator : Climb' Class
        /// </summary>
        public class PowerUpClimb : PowerUp
        {
            private Hero hero;

            public PowerUpClimb(Hero hero)
            {
                this.hero = hero;

                Debug.Log("Add New Power : Climb");
            }

            public override void Power()
            {
                Debug.Log("Power : Climb");
                hero.Power();
            }
        }

        /// <summary>
        /// The 'Concrete Decorator : WebShoot' Class
        /// </summary>
        public class PowerUpWebShoot : PowerUp
        {
            private Hero hero;

            public PowerUpWebShoot(Hero hero)
            {
                this.hero = hero;

                Debug.Log("Add New Power : Web Shoot");
            }

            public override void Power()
            {
                Debug.Log("Power : Web Shoot");
                hero.Power();
            }
        }
    }
    {% endhighlight %}

5. 확인 : 아래 스크립트는 'Spiderman' 에게 동적으로 새로운 능력을 추가하는 방법을 보여준다.

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

                hero = new PowerUpClimb(hero);

                hero.Power();

                hero = new PowerUpWebShoot(hero);

                hero.Power();
            }
        }
    }
    {% endhighlight %}

## Conclusion

데코레이터 패턴은 Unity 게임 개발 프로젝트에 유연성과 역동성을 추가하는 매력적인 해결책을 제공합니다. 이 패턴을 이해하고 구현함으로써, 적응력이 높고 확장가능한 게임 기능을 구현할 수 있으며 전반적인 게임 경험을 향상시킬 수 있습니다.
