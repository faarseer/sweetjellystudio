---
layout: post
title:  "Flyweight Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
---

## INTRO

## UML

## IMPLEMENTATION WITH UNITY

{% highlight csharp %}
using UnityEngine;

namespace Flyweight
{
    public class Flyweight
    {
        private float independentNum;
        private Data data;

        public Flyweight(Data data)
        {
            independentNum = Random.Range(0,100);
            this.data = data;
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Flyweight
{
    public class Heavyweight
    {
        private float independentNum;
        private Data data;

        public Heavyweight()
        {
            independentNum = Random.Range(0,100);
            this.data = new Data();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
namespace Flyweight
{
    public class Data
    {
        private float number1 = 1f;
        private float number2 = 2f;
        private float number3 = 3f;
        private float number4 = 4f;

        // ...

        private float number18 = 18f;
        private float number19 = 19f;
        private float number20 = 20f;
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;
using System.Collections.Generic;

namespace Flyweight
{
    public class Client : MonoBehaviour
    {
        private List<Flyweight> flyweights = new List<Flyweight>();
        private List<Heavyweight> heavyweights = new List<Heavyweight>();
        void Start()
        {
            for(int i=0;i<1000000;i++)
            {
                Heavyweight heavy = new Heavyweight();
                heavyweights.Add(heavy);

                Data data = new Data();
                Flyweight fly = new Flyweight(data);
                flyweights.Add(fly);
            }
        }
    }
}
{% endhighlight %}
