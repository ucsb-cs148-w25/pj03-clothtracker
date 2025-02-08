from bs4 import BeautifulSoup
import csv

def extract_link_text(html_file_path, output_csv_path):
    """
    Extract link text from HTML file and save to CSV with counter and 'L&S' column.
    
    Args:
        html_file_path (str): Path to input HTML file
        output_csv_path (str): Path for output CSV file
    """
    # Read HTML file
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()
    
    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all <a> tags within <li> elements
    links = soup.find_all('a')
    
    # Extract link text and write to CSV
    with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # Write header if desired
        # writer.writerow(['Counter', 'Link Text', 'Column3'])
        
        # Write data rows
        for i, link in enumerate(links, start=64):
            # Get text and remove any extra whitespace
            link_text = link.get_text(strip=True)
            writer.writerow([i, link_text, 'CCS'])

# Usage example
if __name__ == "__main__":
    extract_link_text('list.html', 'majors_ccs.csv')