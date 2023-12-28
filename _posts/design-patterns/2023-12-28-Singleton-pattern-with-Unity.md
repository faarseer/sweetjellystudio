---
layout: post
title:  "Singleton Pattern With Unity"
author: SWeetJelly
categories: [ c#, design pattern, unity ]
image: assets/images/5.jpg
featured: true
---

## Intro

### UML

## With Unity

### MonoBehaviour 를 상속하는 Singleton pattern

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    public class ConcreteSingleton : MonoBehaviour
    {
        private static ConcreteSingleton instance;

        private void Awake()
        {
            if(instance == null)
            {
                instance = this;

                DontDestroyOnLoad(gameObject);
            }
        }

        public void Init()
        {
            Debug.Log("Concrete Singleton Init");
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    [CreateAssetMenu(fileName = "Concrete Singleton Init Module", menuName = "Settings/Concrete Singleton Init Module")]
    public class ConcreteSingletonInitModule : InitModule
    {
        public override void CreateComponent(InitController initController)
        {
            ConcreteSingleton singleton = initController.gameObject.AddComponent<ConcreteSingleton>();

            singleton.Init();
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    public abstract class InitModule : ScriptableObject
    {
        public abstract void CreateComponent(InitController initController);
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    [CreateAssetMenu(fileName = "Init Settings", menuName = "Settings/Init Settings")]
    public class InitSettings : ScriptableObject
    {
        [SerializeField]
        InitModule[] initModules;

        public void Init(InitController initController)
        {
            for(int i=0;i<initModules.Length;i++)
            {
                initModules[i].CreateComponent(initController);
            }
        }
    }
}
{% endhighlight %}

{% highlight csharp %}
using UnityEngine;

namespace Singleton
{
    [DefaultExecutionOrder(-512)]
    public class InitController : MonoBehaviour
    {
        [SerializeField]
        InitSettings initSettings;

        void Awake()
        {
            DontDestroyOnLoad(gameObject);

            initSettings.Init(this);
        }
    }
}
{% endhighlight %}
