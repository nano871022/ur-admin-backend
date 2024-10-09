package models

import (
        "sync"
        "time"
)

type Cache struct{
        Data map[string]interface{}
        Mu   sync.RWMutex
}

func NewCache() *Cache {
        return &Cache {
                Data: make( map[string]interface{} ),
        }
}

func (c *Cache) Get(key string) (interface{}, bool) {
        c.Mu.RLock()
        defer c.Mu.RUnlock()
        value, ok := c.Data[key]
        return value, ok
}

func (c *Cache) Set(key string, value interface{}, expiration time.Duration) {
        c.Mu.Lock()
        defer c.Mu.Unlock()
        c.Data[key] = value
}