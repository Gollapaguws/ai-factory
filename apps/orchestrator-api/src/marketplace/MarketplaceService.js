// MarketplaceService.js
// Marketplace & Community Library (stub)

export default class MarketplaceService {
  static items = [
    { name: "Slack Integration", type: "Integration", author: "Alice" },
    { name: "Data Cleanse Template", type: "Template", author: "Bob" },
    { name: "Sentiment AI Model", type: "AI Model", author: "Carol" },
  ];

  static listItems() {
    return this.items;
  }

  static addItem(item) {
    this.items.push(item);
  }
}
