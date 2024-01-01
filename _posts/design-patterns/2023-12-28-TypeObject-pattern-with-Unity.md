---
layout: post
title:  "TypeObject Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

인스턴스 마다 개념적으로 다른 타입을 의미한다.

몬스터라는 객체가 있다. 이를 다양하게 만들고 싶다. 그래서 몬스터를 상속하는 Dragon, Troll, Orc 등 여러개를 만들었다. 컴파일 후, 비 프로그래머 개발자가 Elf 를 넣고 싶다. 그러나 그러기 위해서는 Elf 를 위한 스크립트를 다시 작성해야 한다.

몬스터가 Breed 라는 종족을 갖고 있으면 Breed 인스턴스를 만들고 다른 값을 입력하는 것 만으로 다른 종족을 만들 수 있다. "코드 수정 없이 새로운 타입을 정의할 수 있다."

코드에서 클래스 상속으로 만들던 타입 시스템의 일부를 런타임에 정의할 수 있도록 데이터로 옮긴것이다.

즉, 데이터만으로 전혀 다른 몬스터를 정의할 수 있고, 기획자도 쉽게 새로운 몬스터를 만들 수 있다.

인스턴스 별로 다른 데이터 -> Typed Object
타입끼리 공유하는 데이터나 동작 -> Type Object

같은 타입 객체를 참조하는 Typed Object 끼리는 같은 '타입' 인것 처럼 움직인다.

다양한 종류를 정의해야 하는데, 개발 언어의 타입 시스템이 유연하지 않아 포드로 표현하기 어려울 때,

- 나중에 어떤 타입이 필요한지 알 수 없을 때
- Compile 이나 코드 변경없이 새로운 타입 추가

유연성을 얻는 건 좋지만, 타입을 코드가 아닌 데이터로 표현하면서 잃는 것은?

- 동작을 구현해두고 타입객체에서 선택하도록
- 바이트 코드 + 인터프리터 패턴 > "동작 정의" 를 코드에서 데이터로

## With UNITY

{% highlight csharp %}
namespace TypeObject
{
    /// <summary>
    /// The 'Type Object' Class
    /// </summary>
    public class Breed
    {
        private int health;
        public int Health => health;
        private string attackName;
        public string AttackName => attackName;

        public Breed(int health, string attackName)
        {
            this.health = health;
            this.attackName = attackName;
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace TypeObject
{
    /// <summary>
    /// The 'Typed Object' Class
    /// </summary>
    public class Monster
    {
        private Breed breed;
        private int health;
        public Monster(Breed breed)
        {
            this.breed = breed;
            this.health= breed.Health;
        }

        public string GetAttackName()
        {
            return breed.AttackName;
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace TypeObject
{
    public class TypeObjectClient : MonoBehaviour
    {
        void Start()
        {
            Breed orcType = new Breed(100,"Orc-Attack");
            Monster orc = new Monster(orcType);

            orc.GetAttackName();
        }
    }
}
{% endhighlight %}
